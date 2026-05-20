import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import {
  Compass,
  Plus,
  Send,
  Trash2,
  MessagesSquare,
} from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "Chat with WanderBot · WanderCraft" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };
type Session = { id: string; title: string; updated_at: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "👋 Hey there! I'm **WanderBot** — your AI travel assistant.\n\nI can help you with:\n- 🗺️ Day-by-day itineraries\n- 🏨 Real hotels with ₹ pricing\n- 🍛 Local food & restaurants\n- 🚆 Routes & transport tips\n- 💰 Honest budgets\n\nWhere are you dreaming of going?",
};

const SUGGESTIONS = [
  "5-day Goa trip from Mumbai for 2 people",
  "Best hotels in Manali under ₹3,000",
  "Must-try restaurants in Jaipur",
  "Bali itinerary for first-timers",
];

function renderMarkdown(text: string) {
  marked.setOptions({ breaks: true, gfm: true });
  return DOMPurify.sanitize(marked.parse(text) as string);
}

function ChatPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load sessions
  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_sessions")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) return;
        setSessions(data ?? []);
      });
  }, [user]);

  // Load messages on session switch
  useEffect(() => {
    if (!activeId) {
      setMessages([WELCOME]);
      return;
    }
    supabase
      .from("chat_messages")
      .select("role,content")
      .eq("session_id", activeId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        const loaded = (data ?? []) as Msg[];
        setMessages(loaded.length ? loaded : [WELCOME]);
      });
  }, [activeId]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function ensureSession(firstUserMsg: string): Promise<string> {
    if (activeId) return activeId;
    const title = firstUserMsg.slice(0, 60);
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user!.id, title })
      .select("id,title,updated_at")
      .single();
    if (error || !data) throw error ?? new Error("Failed to create session");
    setSessions((s) => [data, ...s]);
    setActiveId(data.id);
    return data.id;
  }

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || streaming) return;
    setInput("");

    // Filter welcome out of payload
    const history = messages.filter((m) => m !== WELCOME);
    const nextMessages: Msg[] = [...messages, { role: "user", content: msg }, { role: "assistant", content: "" }];
    setMessages(nextMessages);
    setStreaming(true);

    let sessionId: string;
    try {
      sessionId = await ensureSession(msg);
    } catch (e) {
      toast.error("Couldn't save chat — check your connection.");
      setStreaming(false);
      return;
    }

    // Persist user message
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      user_id: user!.id,
      role: "user",
      content: msg,
    });

    // Call the streaming server function
    let assembled = "";
    try {
      const { streamChat } = await import("@/lib/chat.functions");
      const response = (await streamChat({
        data: { messages: [...history, { role: "user", content: msg }] },
      })) as unknown as Response;

      if (!response.ok || !response.body) {
        const errBody = await response.text().catch(() => "");
        throw new Error(errBody || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            done = true;
            break;
          }
          try {
            const json = JSON.parse(payload);
            const chunk: string | undefined = json.choices?.[0]?.delta?.content;
            if (chunk) {
              assembled += chunk;
              setMessages((prev) => {
                const next = prev.slice();
                next[next.length - 1] = { role: "assistant", content: assembled };
                return next;
              });
            }
          } catch {
            // partial JSON across boundary — push back
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection error";
      assembled = `⚠️ ${message}`;
      setMessages((prev) => {
        const next = prev.slice();
        next[next.length - 1] = { role: "assistant", content: assembled };
        return next;
      });
    }

    // Persist assistant reply
    if (assembled && !assembled.startsWith("⚠️")) {
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        user_id: user!.id,
        role: "assistant",
        content: assembled,
      });
      await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", sessionId);
    }
    setStreaming(false);
  }

  function newChat() {
    setActiveId(null);
    setMessages([WELCOME]);
  }

  async function deleteSession(id: string) {
    await supabase.from("chat_sessions").delete().eq("id", id);
    setSessions((s) => s.filter((x) => x.id !== id));
    if (activeId === id) newChat();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-5 py-6 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col gap-3 md:flex">
          <Button onClick={newChat} className="h-10 w-full justify-start rounded-full">
            <Plus className="mr-2 h-4 w-4" /> New chat
          </Button>
          <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-2">
            {sessions.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                Your saved chats will live here.
              </p>
            ) : (
              <ul className="space-y-1">
                {sessions.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setActiveId(s.id)}
                      className={`group flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                        activeId === s.id
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <MessagesSquare className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{s.title}</span>
                      </span>
                      <Trash2
                        className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(s.id);
                        }}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Chat */}
        <main className="flex min-h-[70vh] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-6 md:px-8">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} streaming={streaming && i === messages.length - 1 && m.role === "assistant"} />
            ))}
            {messages.length <= 1 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border bg-background/60 p-3 md:p-4"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft focus-within:border-primary/50">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask WanderBot anything about travel…"
                rows={1}
                className="min-h-[40px] max-h-40 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button
                type="submit"
                size="icon"
                disabled={streaming || !input.trim()}
                className="h-10 w-10 shrink-0 rounded-full shadow-coral"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              WanderBot can make mistakes — always verify prices and availability.
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}

function Bubble({ role, content, streaming }: { role: "user" | "assistant"; content: string; streaming?: boolean }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground shadow-coral">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary/15 text-secondary">
        <Compass className="h-4 w-4" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-accent/60 px-4 py-3 text-foreground">
        <div
          className={`prose-chat text-[15px] ${streaming && !content ? "typing-cursor" : ""}`}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content || "") }}
        />
        {streaming && content ? <span className="typing-cursor" /> : null}
      </div>
    </div>
  );
}
