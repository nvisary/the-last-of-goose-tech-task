import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/ui/Button";
import { Input } from "@shared/ui/Input";
import { Card } from "@shared/ui/Card";
import { login as loginApi } from "@features/AuthByUsername/api/login";
import { useUserStore } from "@entities/User/model/store";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user } = await loginApi(username, password);
      login(user);
      navigate("/rounds");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="LOGIN" className="w-full max-w-md mx-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          error={error || undefined}
        />

        <div className="pt-2">
          <Button type="submit" isLoading={isLoading}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};
