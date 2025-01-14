"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import io from "socket.io-client";

type ChatMessage = {
  owner: boolean;
  content: string;
};

const ChatBox = () => {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/");
      return;
    }

    const { id } = JSON.parse(user);
    const storedChat = localStorage.getItem(`chatMessages_${id}`);
    if (storedChat) {
      setChat(JSON.parse(storedChat));
    }

    const socketConnection = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
      transports: ["websocket"],
    });
    setSocket(socketConnection);

    socketConnection.on("message", (message: ChatMessage) => {
      appendChat(message);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const appendChat = (message: ChatMessage) => {
    setChat((prevChat) => {
      const updatedChat = [...prevChat, message];
      const user = localStorage.getItem("user");
      if (user) {
        const { id } = JSON.parse(user);
        localStorage.setItem(`chatMessages_${id}`, JSON.stringify(updatedChat));
      }
      return updatedChat;
    });
  };

  const sendMessage = (message: ChatMessage) => {
    appendChat(message);
    socket.emit("message", message);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-grow overflow-y-scroll overflow-x-hidden px-4 pb-4 sm:px-6 lg:px-10 bg-white dark:bg-transparent text-black dark:text-white">
        {chat.map((message, index) => (
          <ChatBubble key={index} message={message} />
        ))}
        <div className="py-2" ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 w-full px-4 py-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-gray-900 text-slate-black dark:text-slate-200">
        <ChatInput appendChat={sendMessage} />
      </div>
    </div>
  );
};

export default ChatBox;
