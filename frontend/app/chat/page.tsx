"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import type { Socket } from "socket.io-client";
import api from "@/lib/api";
import useAuthStore from "@/lib/stores/authStore";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: { id: string; name: string; avatar?: string };
}

interface Conversation {
  id: string;
  participants: { id: string; name: string; avatar?: string }[];
  messages: Message[];
}

export default function ChatPage() {
  const { user, token } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    const { io } = await import("socket.io-client");
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000", { auth: { token } });
    socketRef.current = socket;
    socket.on("new-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => { socket.disconnect(); };
  }, [token]);

  useEffect(() => {
    api.get("/chat/conversations").then((r) => setConversations(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!active) return;
    api.get(`/chat/conversations/${active}/messages`).then((r) => setMessages(r.data));
    socketRef.current?.emit("join-conversation", active);
  }, [active]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !active) return;
    socketRef.current?.emit("send-message", { conversationId: active, content: input.trim() });
    setInput("");
  };

  const activeConv = conversations.find((c) => c.id === active);
  const otherUser = activeConv?.participants.find((p) => p.id !== user?.id);

  if (!user) return (
    <div className="container py-16 text-center text-gray-500">Connectez-vous pour accéder au chat</div>
  );

  return (
    <div className="container py-4">
      <h1 className="text-2xl font-bold mb-4">Messages / <span className="font-arabic">الرسائل</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[70vh]">
        {/* Conversations list */}
        <div className="card overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucune conversation</p>
            </div>
          ) : (
            conversations.map((c) => {
              const other = c.participants.find((p) => p.id !== user.id);
              const last = c.messages[0];
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`w-full flex gap-3 p-4 hover:bg-muted transition-colors text-left border-b border-border last:border-0 ${active === c.id ? "bg-muted" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold shrink-0">
                    {other?.name[0] || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{other?.name}</p>
                    {last && <p className="text-xs text-gray-500 truncate">{last.content}</p>}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 card flex flex-col">
          {active && otherUser ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm">
                  {otherUser.name[0]}
                </div>
                <p className="font-medium">{otherUser.name}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.senderId === user.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${m.senderId === user.id ? "bg-primary text-white rounded-br-sm" : "bg-muted text-gray-800 rounded-bl-sm"}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="p-4 border-t border-border flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Écrire un message..."
                  className="input flex-1"
                />
                <button onClick={sendMessage} className="btn-primary px-4 rounded-lg">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Sélectionnez une conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
