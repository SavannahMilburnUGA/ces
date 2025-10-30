"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Admin state variable
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  //Check login state (cookie + localStorage) and react to storage changes
  useEffect(() => {
    const checkLogin = () => {
      const hasCookie = document.cookie
        .split("; ")
        .some((row) => row.startsWith("userSession="));
      const hasLocalFlag = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(hasCookie || hasLocalFlag);

      // Check if user has admin role
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === "admin");
      } else {
        setIsAdmin(false); 
      } // if 
    };

    checkLogin(); // initial check

    //Listen to storage changes from other tabs
    window.addEventListener("storage", checkLogin);

    //Also listen for custom event in current tab
    window.addEventListener("loginStatusChanged", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("loginStatusChanged", checkLogin);
    };
  }, []);

  //Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("isLoggedIn"); // clear local flag
      localStorage.removeItem("user"); // clear admin vs. user data 
      setIsLoggedIn(false);
      router.push("/"); // redirect home
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav style={{ backgroundColor: "#0B090A" }} className="shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="CES logo"
              width={60}
              height={60}
              className="object-contain"
            />
            <Link
              href="/"
              className="text-2xl font-bold hover:opacity-90 transition"
              style={{ fontFamily: "var(--font-archivo)" }}
            >
              CES
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="transition duration-200"
                style={{ color: "#D3D3D3" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E5383B")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#D3D3D3")}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="transition duration-200"
                style={{ color: "#D3D3D3" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E5383B")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#D3D3D3")}
              >
                All Movies
              </Link>
              <Link
                href="/showtimes"
                className="transition duration-200"
                style={{ color: "#D3D3D3" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E5383B")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#D3D3D3")}
              >
                By Showtimes
              </Link>
              {isLoggedIn && isAdmin && (
                <Link
                href="/admin"
                className="transition duration-200"
                style={{ color: "#D3D3D3" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E5383B")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#D3D3D3")}
              >
                Admin
              </Link>
              )}
              

              {/*Show Profile button if logged in */}
              {isLoggedIn && (
                <Link
                  href="/edit-profile"
                  className="transition duration-200 border border-[#E5383B] px-4 py-1 rounded-md text-[#E5383B] hover:bg-[#E5383B] hover:text-white"
                >
                  Profile
                </Link>
              )}

              {/* Conditional login/logout */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="transition duration-200 border border-[#E5383B] px-4 py-1 rounded-md text-[#E5383B] hover:bg-[#E5383B] hover:text-white"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="transition duration-200 border border-[#E5383B] px-4 py-1 rounded-md"
                  style={{ color: "#E5383B" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#E5383B";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#E5383B";
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
