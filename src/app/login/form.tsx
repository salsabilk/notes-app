"use client";
import { login } from "@/actions/login-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function LoginForm() {
  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      setIsLoading(true);
      await login(email, password);
    } catch {
      setMessage("username or password is incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            className={`p-2 border rounded-md ${
              message ? "border-red-500" : "border-gray-300"
            }`}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            disabled={isLoading}
            placeholder="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            value={password}
            className={`p-2 border rounded-md ${
              message ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            required
          />
        </div>
        {message && <p className="text-red-500 text-center">{message}</p>}

        <Button disabled={isLoading} type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>
  );
}
