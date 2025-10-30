"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ValidatedAgenciesPage() {
    const [agencies, setAgencies] = useState<any[]>([]);

    useEffect(() => {
        const list = JSON.parse(
            localStorage.getItem("shield_agencies_validated") || "[]"
        );
        setAgencies(list);
    }, []);

    return (
        <div className="min-h-screen bg-[#f9fbff]">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
                    <h1 className="text-xl font-bold text-[#2f487d] flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Validated Agencies
                    </h1>
                    <Link
                        href="/system-dashboard"
                        className="text-sm bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-full text-slate-600 flex items-center gap-1"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-10">
                {agencies.length === 0 ? (
                    <p className="text-center text-slate-500 italic">
                        No validated agencies found 🗂️
                    </p>
                ) : (
                    <div className="flex flex-col divide-y divide-slate-200 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        {agencies.map((a, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 transition"
                            >
                                <div>
                                    <h3 className="font-semibold text-[#2f487d]">
                                        {a.agencyName || "Unnamed Agency"}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        UEN: {a.uen || "—"} • License: {a.license || "—"}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Contact: {a.contactPerson || "—"} ({a.contactNumber || "—"})
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Plan: {a.plan || "Free"} • Validated on:{" "}
                                        {a.validatedAt
                                            ? new Date(a.validatedAt).toLocaleDateString()
                                            : "—"}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
