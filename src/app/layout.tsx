// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "DApps - Evoting 1.0",
//   description: "Decentralization Apps EVoting Integrated with Local Blockchain",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }


// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Font Anda
import "./globals.css";
import { Web3Provider } from "@/contexts/Web3Provider"; // Import Provider
import Navbar from "@/components/Navbar"; // Import Navbar Anda

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DApps - Evoting 1.0",
  description: "Decentralization Apps EVoting Integrated with Local Blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider> {/* 1. Bungkus semuanya dengan Provider */}
          {/* <Navbar />   2. Panggil komponen Navbar Anda */}
          <main className="pt-24"> {/* 3. Bungkus children dengan main dan beri padding-top */}
            {children}
          </main>
        </Web3Provider>
      </body>
    </html>
  );
}
