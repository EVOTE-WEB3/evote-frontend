
"use client"; 

import React from 'react';
import Head from 'next/head'; 
import { motion, easeOut } from 'framer-motion';


interface KeyPointCardProps {
  icon: string; // Bisa emoji atau karakter spesial
  title: string;
  description: string;
  delay?: number; // Opsional untuk stagger animation
}

const KeyPointCard: React.FC<KeyPointCardProps> = ({ icon, title, description, delay = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        delay,
      },
    },
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-850 shadow-lg rounded-xl p-8 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transform hover:scale-[1.03] transition-transform duration-300 ease-in-out cursor-pointer group"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="text-5xl mb-6 text-blue-600 dark:text-blue-400 group-hover:animate-bounce-icon">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 leading-snug">
        {title}
      </h3>
      <p className="text-md text-gray-700 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

const AboutPage: React.FC = () => {
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans">
      <Head>
        <title>Tentang Web3 Voting Kami | Kunci Keunggulan</title>
        <meta name="description" content="Temukan poin-poin kunci keunggulan platform voting Web3 kami: Transparan, Aman, Desentralisasi, dan mudah digunakan." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-6 py-16 max-w-6xl">
        <motion.header
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold text-blue-700 dark:text-blue-400 leading-tight mb-6 tracking-tight">
            Mengapa <span className="text-indigo-600 dark:text-indigo-300">Memilih Kami</span>?
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Platform voting Web3 kami menawarkan keunggulan tak tertandingi untuk masa depan demokrasi digital.
          </p>
        </motion.header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <KeyPointCard
            icon="✨"
            title="Transparansi Penuh"
            description="Setiap suara tercatat di blockchain, dapat diverifikasi publik, memastikan integritas tanpa keraguan."
            delay={0.1}
          />
          <KeyPointCard
            icon="🔒"
            title="Keamanan Utama"
            description="Dilindungi oleh kriptografi canggih, suara Anda aman dari manipulasi dan peretasan."
            delay={0.2}
          />
          <KeyPointCard
            icon="🔗"
            title="Anti-Manipulasi"
            description="Sekali suara tercatat, tidak dapat diubah atau dihapus, menjaga keaslian hasil."
            delay={0.3}
          />
          <KeyPointCard
            icon="🌐"
            title="Aksesibilitas Global"
            description="Mudah digunakan dan dapat diakses siapa saja dari mana pun dengan koneksi internet."
            delay={0.4}
          />
          <KeyPointCard
            icon="🚀"
            title="Desentralisasi Sejati"
            description="Tidak ada entitas pusat yang mengontrol, menjamin keadilan dan mengurangi bias."
            delay={0.5}
          />
          <KeyPointCard
            icon="⚡"
            title="Efisiensi Real-time"
            description="Hasil voting dihitung dan ditampilkan secara instan, transparan dan akurat."
            delay={0.6}
          />
        </section>

        <motion.section
          className="bg-white dark:bg-gray-850 shadow-xl rounded-2xl p-10 md:p-12 text-center border border-gray-200 dark:border-gray-700 transform hover:scale-[1.01] transition-transform duration-300 ease-in-out"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8 leading-snug">
            Visi Kami
          </h2>
          <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Kami envisionsikan masa depan di mana setiap individu memiliki suara yang berarti dan terhitung, dijamin oleh kekuatan teknologi blockchain. Tujuan kami adalah merevolusi cara pemilihan dilakukan, menjadikannya lebih adil, terbuka, dan dapat dipercaya untuk semua.
          </p>
          <motion.button
            className="mt-10 px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Ini adalah placeholder untuk navigasi ke halaman voting atau informasi lebih lanjut!')}
          >
            Mulai Voting Sekarang!
          </motion.button>
        </motion.section>
      </main>

      <footer className="text-center py-10 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p className="text-md md:text-lg">&copy; {new Date().getFullYear()} Web3 Voting. Semua hak dilindungi undang-undang.</p>
        <p className="text-sm mt-2">Dibuat dengan ❤️ di era digital.</p>
      </footer>
    </div>
  );
};

export default AboutPage;