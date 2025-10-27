"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Building2, UserCheck, Settings } from "lucide-react";

export default function HomePage() {
  const portals = [
    {
      title: "Agency Portal",
      desc: "Post jobs, manage deployments, and review officers easily.",
      icon: <Building2 className="w-8 h-8 text-white" />,
      href: "/agency",
      gradient: "from-[#365597] to-[#2f487d]",
    },
    {
      title: "Officer Portal",
      desc: "Find jobs nearby, commit to shifts, and build your profile.",
      icon: <UserCheck className="w-8 h-8 text-white" />,
      href: "/officer",
      gradient: "from-[#2f487d] to-[#1e3164]",
    },
    {
      title: "Admin Dashboard",
      desc: "Monitor activity, manage users, and oversee operations.",
      icon: <Settings className="w-8 h-8 text-white" />,
      href: "/admin",
      gradient: "from-[#1e3164] to-[#142549]",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fbff]">
      {/* Hero Header */}
      <header className="text-center mt-14 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-[#365597] to-[#2f487d] shadow-lg mb-4"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#365597]/40 to-[#2f487d]/40 blur-xl opacity-60" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-[#2f487d] tracking-tight">
          Welcome to Shield
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Smart Deployment. Real-Time. Secure.
        </p>
      </header>

      {/* Portal Cards */}
      <main className="flex-1 w-full flex items-center justify-center">
        <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-8 px-8 py-8 mb-20">
          {portals.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1, delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center p-8 border border-slate-100"
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-r ${p.gradient} shadow-md mb-5`}
              >
                {p.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#2f487d]">{p.title}</h3>
              <p className="text-slate-600 text-sm mt-2 mb-6 leading-relaxed">
                {p.desc}
              </p>
              <Link
                href={p.href}
                className={`bg-gradient-to-r ${p.gradient} text-white rounded-full px-6 py-2.5 text-sm font-medium shadow hover:shadow-lg transition-all`}
              >
                Enter
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Floating Footer Nav */}
      <footer className="w-full bg-white/80 backdrop-blur-md border-t border-slate-200 fixed bottom-0 left-0 px-6 py-4 flex justify-center shadow-sm rounded-t-3xl">
        <p className="text-sm text-slate-500">
          © 2025 <span className="font-semibold text-[#2f487d]">Shield Connect</span> — Built for Security Agencies
        </p>
      </footer>
    </div>
  );
}
