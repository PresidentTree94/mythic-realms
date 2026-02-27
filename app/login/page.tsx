"use client";
import { useState } from "react";
import { Shield, Lock } from "lucide-react";

export default function Login() {

  const [password, setPassword] = useState("");

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      document.cookie = "auth=true; path=/";
      window.location.href = "/";
    } else {
      alert("Incorrect password.");
    }
  }

  return (
    <article className="flex justify-center items-center min-h-dvh p-4 bg-background/10 backdrop-blur-sm">
      <form className="card flex flex-col items-center" onSubmit={handleSubmit}>
        <div className="flex justify-center items-center bg-primary/10 h-16 w-16 rounded-full">
          <Shield className="h-8 w-auto text-primary" />
        </div>
        <h3 className="mt-4 mb-2">Mythic Realms</h3>
        <p className="font-serif italic">Enter the password to unlock the compendium.</p>
        <div className="flex items-center gap-2 w-full bg-background border border-border focus-within:border-secondary px-2 py-1 mt-6 mb-4">
          <Lock className="h-4 w-auto text-primary" />
          <input type="password" placeholder="Enter password..." className="flex-1 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="bg-primary text-background px-4 py-2 font-heading font-medium cursor-pointer">Unlock Realm</button>
      </form>
    </article>
  );
}