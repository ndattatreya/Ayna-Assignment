"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader2, SendHorizontal } from "lucide-react";

type ChatMessage = {
  owner: boolean;
  content: string;
};

interface ChatInputProps {
  appendChat: (message: ChatMessage) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ appendChat }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setLoading(true);
    const Message = { owner: true, content: message };
    appendChat(Message);
    setMessage("");
    setLoading(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-[10vh] ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row items-center justify-between px-3 py-2 mx-4 sm:mx-6 lg:mx-10 xl:mx-18 2xl:mx-48 border-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-gray-900 text-slate-black dark:text-slate-200"
      >
        <input
          ref={inputRef}
          disabled={loading}
          value={message}
          type="text"
          placeholder="Send a message"
          className="w-full h-[4vh] bg-slate-100 dark:bg-gray-900 placeholder-slate-300 dark:placeholder-slate-500 focus:outline-none"
          onChange={(e) => setMessage(e.target.value)}
        />
        {!loading ? (
          <button
            type="submit"
            disabled={loading}
            className="p-2 px-4 bg-slate-200 dark:bg-gray-800 
             hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl"
          >
            <SendHorizontal size={28} color="#aeadad" strokeWidth={2.25} />
          </button>
        ) : (
          <div className="flex flex-row items-center h-10 mr-4">
            <Loader2 />
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
