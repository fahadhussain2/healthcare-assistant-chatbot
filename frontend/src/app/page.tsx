"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBox from "./_components/MessageBox";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const url = threadId
        ? `https://healthcare-assistant.onrender.com/health-professional/${threadId}`
        : "https://healthcare-assistant.onrender.com/health-professional";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        if (!threadId && data.thread_id) {
          setThreadId(data.thread_id);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { user, error, isLoading: isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="h-dvh md:p-4 w-full flex items-center justify-center">
        <Loader className="mx-auto my-auto animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh md:p-4 w-full flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please try reloading</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return redirect("/api/auth/login");
  }

  return (
    <div className="h-dvh md:p-4 w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto flex flex-col h-full md:rounded-md rounded-none">
        <CardHeader>
          <CardTitle>AI Health Assistant</CardTitle>
        </CardHeader>
        <CardContent className="h-0 flex-grow pr-0">
          <ScrollArea className="h-full pr-6" ref={scrollAreaRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.role === "user" ? (
                  <span className="inline-block p-2 rounded-lg bg-blue-500 text-white">
                    {message.content}
                  </span>
                ) : (
                  <MessageBox value={message.content} />
                )}
              </div>
            ))}
            {isLoading && (
              <div className={`mb-4 text-left`}>
                <span className="inline-block p-2 rounded-lg bg-gray-200 text-gray-900 animate-bounce">
                  ...
                </span>
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={sendMessage} className="flex w-full space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
