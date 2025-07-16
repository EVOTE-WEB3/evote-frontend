"use client"

import React from "react";
import Link from "next/link";
import { FiInstagram } from "react-icons/fi";
import { SlSocialLinkedin } from "react-icons/sl";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { ConnectWalletButton } from "./ConnectWalletBtn";

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 z-50 w-full px-8 py-6 text-black">
      <div className="flex items-center justify-between">
        {/* Bagian Kiri: Logo */}
        <div className="flex items-center">
          {/* <Link href="/" >
            <a className="font-bebas text-4xl font-bold tracking-wider">
              Your Creative
            </a>
          </Link> */}
        </div>

        {/* Bagian Kanan: Tombol & Ikon */}
        <div className="flex items-center gap-x-6">
          {/* Tombol Contact */}
          <button className="hidden sm:flex items-center gap-x-2 rounded-full border border-neutral-400 px-5 py-2 text-sm font-medium tracking-wide text-neutral-700 transition-colors hover:bg-black hover:text-white">
            <span>CONTACT</span>
            <HiOutlineArrowNarrowRight />
          </button>

          <ConnectWalletButton/>

          {/* Ikon Sosial & Pencarian */}
          <div className="flex items-center gap-x-2 ">
            <a
              href="https://instagram.com/mf.en.er"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 text-neutral-700 transition-colors hover:bg-black hover:text-white"
            >
              <FiInstagram size={18} />
            </a>
            <a
              href="https://linkedin.com/in/mf-rohman/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 text-neutral-700 transition-colors hover:bg-black hover:text-white"
            >
              <SlSocialLinkedin size={18} />
            </a>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 text-neutral-700 transition-colors hover:bg-black hover:text-white">
              <IoSearchOutline size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
