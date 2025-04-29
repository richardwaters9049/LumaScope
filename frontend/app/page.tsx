"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LumaLogo from "@/public/images/luma-logo-4.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("justLoggedIn", "true");

        // Delay to ensure localStorage is written before redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 50);
      } else {
        toast.error("Invalid credentials ❌");
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <main className="p-3 m-3 flex flex-col items-center justify-center h-screen w-screen gap-4">
      <Image
        src={LumaLogo}
        alt="LumaScope Logo"
        width={250}
        height={250}
        priority
      />
      <h1 className="text-4xl font-medium tracking-widest text-blue-950 my-6">
        LumaScope
      </h1>
      <form
        onSubmit={handleLogin}
        className="login-container m-4 p-4 flex flex-col items-center justify-center gap-5 w-full max-w-md tracking-widest"
      >
        <Input
          placeholder="Email"
          className="p-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          className="p-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="p-6 my-5 text-2xl">
          LOGIN
        </Button>
      </form>
    </main>
  );
}
