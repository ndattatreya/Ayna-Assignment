"use client";
import ChatBox from "@/components/chat/ChatBox";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  });
  return (
    <div className="flex flex-col w-full">
      <Header />
      <ChatBox />
    </div>
  );
}
