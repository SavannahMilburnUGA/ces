"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [remember, setRemember] = useState(false);
    // Handling state for admin
    const [isAdmin, setIsAdmin] = useState(false); 

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
    
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, isAdmin }),
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
    
        // Route to proper home page based on user or admin status
        if (isAdmin) {
          router.push("/admin")
        } else {
          router.push(data.redirectTo || "/user/home");
        } // if
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
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className = "w-4 h-4" style = {{ accentColor: '#A4161A' }}
                />
                <span className="font-semibold" style={{ color: '#A4161A' }}> Admin </span>
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
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    );
}