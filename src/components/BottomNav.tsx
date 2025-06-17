import React from "react";
import Link from "next/link";

// Definisikan item navigasi dalam sebuah array agar mudah dikelola
const navItems = [
  { name: "CANDIDATE", href: "/candidate" },
  { name: "VOTE", href: "/vote" },
  { name: "SUMMARIZE", href: "/summarize" },
  { name: "ABOUT", href: "/about" },
  { name: "CONTACT", href: "/contact" },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      {/* Container untuk styling bentuk pil dan latar belakang */}
      <div className="flex items-center gap-x-2 rounded-full bg-neutral-800/90 p-2 shadow-lg backdrop-blur-sm">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="rounded-full px-4 py-2 text-sm font-medium tracking-wider text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white font-bold"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
