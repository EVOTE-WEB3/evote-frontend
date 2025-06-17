import Image from "next/image";
import SplitText from "@/components/SplitText";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import TextPressure from "@/components/PressureText";

export default function Home() {
  return (
    <>
      <main className="relative flex items-center justify-center min-h-screen overflow-hidden">
        <Navbar />
        <BottomNav />
        {/* Video sebagai Latar Belakang */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://1xg7ah.leapcellobj.com/oishilife-mdra-zyyp-5rvpmmj3/bg.evote.mp4"
            type="video/mp4"
          />
          Browser Anda tidak mendukung tag video.
        </video>

        {/* Opsional: Overlay gelap untuk membuat teks lebih mudah dibaca */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

        {/* Konten Teks di Depan */}
        <div className="relative z-20 flex flex-col items-start justify-start text-center text-black p-8 md:p-16 py-0.5">
          <TextPressure
            text="Welcome to eVote"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#ff0000"
            minFontSize={300}
          />
          {/* <p className="text-xl md:text-2xl text-gray-200">
            {" "}
            Your secure and transparent voting platform.
          </p> */}
        </div>
      </main>
    </>
  );
}
