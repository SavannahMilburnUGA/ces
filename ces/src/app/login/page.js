"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [remember, setRemember] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
    
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await res.json();
    
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Login failed. Please try again.");
        }
    
        if (remember) {
          localStorage.setItem("rememberUser", email);
        } else {
          localStorage.removeItem("rememberUser");
        }
    
        //Redirect based on backend response
        router.push(data.redirectTo || "/user/home");
        //router.push(data.redirectTo || "/register");
      } catch (err) {
        console.error(err);
        setError(err.message || "Login failed. Please try again.");
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6 text-center text-black">
            User Login
          </h1>
  
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
            <input
              type="email"
              placeholder="Email Address"
              className="border rounded-lg p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
  
            <input
              type="password"
              placeholder="Password"
              className="border rounded-lg p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
  
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
  
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Log In
            </button>
  
            <p className="text-center text-sm">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    );
}