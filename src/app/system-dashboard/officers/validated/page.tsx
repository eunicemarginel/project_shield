"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ValidatedOfficersPage() {
    const [officers, setOfficers] = useState<any[]>([]);

    useEffect(() => {
        const list = JSON.parse(
            localStorage.getItem("shield_officers_validated") || "[]"
        );
        setOfficers(list);
    }, []);

    return (
        <div className="min-h-screen bg-[#f9fbff]">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
                    <h1 className="text-xl font-bold text-[#2f487d] flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Validated Officers
                    </h1>
                    <Link
                        href="/system-dashboard"
                        className="text-sm bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-full text-slate-600 flex items-center gap-1"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                {officers.length === 0 ? (
                    <p className="text-center text-slate-500 italic">
                        No validated officers found 🗂️
                    </p>
                ) : (
                    <div className="flex flex-col divide-y divide-slate-200 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        {officers.map((o, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                className="px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 transition"
                            >
                                <div>
                                    <h3 className="font-semibold text-[#2f487d]">
                                        {o.name || "Unnamed Officer"}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        NRIC: {o.nric || "—"} • Rank: {o.rank || "—"}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        License: {o.licenseNumber || "—"}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Valid until: {o.licenseExpiry || "—"}
                                    </p>
                                </div>

                                <div className="mt-2 sm:mt-0">
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full font-medium ${o.notifications === 0
                                            ? "bg-slate-100 text-slate-600"
                                            : o.notifications === 1
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {o.notifications ?? 0} notif
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
