"use client";

import localFont from "next/font/local";
import "./globals.css";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(Boolean);

  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn");
    const localRole = localStorage.getItem("admin");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
    if (localRole === "true") {
      setAdmin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    router.push("/login");
  };
  const pathname = usePathname();

  useEffect(() => {
    // Check if the user is logged in (simple check from localStorage)
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn && pathname !== "/login") {
      router.push("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [pathname, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // If not logged in, don't render the content
  if (!isLoggedIn && !admin && pathname !== "/login") {
    return null;
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          {pathname !== "/login" && (
            <aside
              className={`fixed lg:relative  mt-5 h-full lg:h-auto lg:mt-0 lg:translate-x-0 top-0  left-0 z-40 bg-gray-200 text-black w-64 lg:w-64  transition-transform transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } lg:translate-x-0`}
            >
              <div className="lg:p-4 py-12 px-4">
                <h1 className="text-2xl font-bold mb-4 lg:mb-6 hidden sm:block lg:block">
                  Abhi Hire
                </h1>
                <ul>
                  <li
                    className={`mb-2 w-full ${
                      pathname === "/volunteers"
                        ? "bg-gray-400"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    <a href="/volunteers" className="block w-full p-2">
                      <p className="text-xl">Volunteers</p>
                    </a>
                  </li>
                  <li
                    className={`mb-2 w-full ${
                      pathname === "/workers"
                        ? "bg-gray-400"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    <a href="/workers" className="block w-full p-2">
                      <p className="text-xl">Workers</p>
                    </a>
                  </li>
                  <li
                    className={`mb-2 w-full ${
                      pathname === "/contractors"
                        ? "bg-gray-400"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    <a href="/contractors" className="block w-full p-2">
                      <p className="text-xl">Contractors</p>
                    </a>
                  </li>
                  <li
                    className={`mb-2 w-full ${
                      pathname === "/works"
                        ? "bg-gray-400"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    <a href="/works" className="block w-full p-2">
                      <p className="text-xl">Works </p>
                    </a>
                  </li>

                  {isLoggedIn && (
                    <button onClick={handleLogout} className="mb-2">
                      <p className="text-xl p-2">Logout</p>
                    </button>
                  )}
                </ul>
              </div>
            </aside>
          )}

          {/* Main content */}
          <main className="flex-1 p-5">
            {/* Top bar */}
            {pathname !== "/login" && (
              <div className="fixed lg:hidden bg-gray-100 top-0 left-0 w-full z-50 shadow p-2 flex items-center justify-between">
                <button
                  onClick={toggleSidebar}
                  className="text-sm bg-gray-900 text-white p-2 rounded hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5"
                    />
                  </svg>
                </button>
                <h1 className="text-lg">Abhi Hire</h1>
              </div>
            )}

            {/* Main Content */}
            <div className="">{children}</div>
            <ToastContainer />
          </main>

          {/* Overlay for mobile when sidebar is open */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
              onClick={toggleSidebar}
            ></div>
          )}
        </div>
      </body>
    </html>
  );
}
