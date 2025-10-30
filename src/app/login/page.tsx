"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Building2, UserCheck, LogIn } from "lucide-react";

export default function LoginSelectionPage() {
    const options = [
        {
            title: "Officer Login",
            desc: "Access your deployment dashboard and manage your shift history.",
            icon: <UserCheck className="w-7 h-7 text-white" />,
            href: "/login/officer",
            gradient: "from-[#365597] to-[#2f487d]",
        },
        {
            title: "Agency Login",
            desc: "Manage job postings, officer assignments, and performance reviews.",
            icon: <Building2 className="w-7 h-7 text-white" />,
            href: "/login/agency",
            gradient: "from-[#2f487d] to-[#1e3164]",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f9fbff] flex flex-col items-center justify-center py-10">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-10"
            >
                <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#365597]/30 to-[#2f487d]/30 blur-xl rounded-full opacity-70" />
                    <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-[#365597] to-[#2f487d] shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold text-[#2f487d] flex items-center justify-center gap-2">
                    <LogIn className="w-6 h-6 text-[#365597]" /> Login to Shield
                </h1>
                <p className="text-slate-600 mt-2 text-sm">
                    Choose your portal below to continue
                </p>
            </motion.header>

            {/* Login Options */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full px-8"
            >
                {options.map((opt, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-md transition"
                    >
                        <div
                            className={`w-14 h-14 flex items-center justify-center mx-auto mb-4 rounded-xl bg-gradient-to-r ${opt.gradient} shadow`}
                        >
                            {opt.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-[#2f487d] mb-2">
                            {opt.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-5">{opt.desc}</p>
                        <Link
                            href={opt.href}
                            className={`inline-block bg-gradient-to-r ${opt.gradient} text-white px-6 py-2 rounded-full text-sm font-medium shadow hover:shadow-md transition`}
                        >
                            Login
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Footer */}
            <footer className="mt-10 text-center text-slate-500 text-sm">
                Don’t have an account yet?{" "}
                <Link href="/" className="text-[#2f487d] font-medium hover:underline">
                    Go back to register
                </Link>
            </footer>
        </div>
    );
}
