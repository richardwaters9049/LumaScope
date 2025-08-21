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
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("justLoggedIn", "true");

        // Extract full_name from JWT and store it
        const tokenParts = data.access_token.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          localStorage.setItem("full_name", payload.full_name);
        }

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
        <Button type="submit" className="p-6 my-5 text-xl tracking-widest">
          LOGIN
        </Button>
      </form>
    </main>
  );
}
