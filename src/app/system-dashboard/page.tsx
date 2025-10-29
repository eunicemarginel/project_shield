"use client";
import { useEffect, useState } from "react";
import { getJobs, saveJobs } from "@/lib/dataStore";
import { Shield, Trash2, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

export default function SystemDashboard() {
    const [authorized, setAuthorized] = useState(false);
    const [input, setInput] = useState("");
    const [jobs, setJobs] = useState<any[]>([]);

    // ✅ Auto-login if session exists
    useEffect(() => {
        const savedAuth = localStorage.getItem("shield_admin_auth");
        if (savedAuth === "granted") setAuthorized(true);
    }, []);

    // ✅ Load jobs once authorized
    useEffect(() => {
        if (authorized) {
            setJobs(getJobs());
            const sync = () => setJobs(getJobs());
            window.addEventListener("storage", sync);
            return () => window.removeEventListener("storage", sync);
        }
    }, [authorized]);

    const handleLogin = () => {
        if (input === "shieldadmin2025") {
            localStorage.setItem("shield_admin_auth", "granted");
            setAuthorized(true);
        } else {
            alert("❌ Invalid access code");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("shield_admin_auth");
        setAuthorized(false);
    };

    const handleReset = () => {
        if (confirm("Clear all jobs from local storage?")) {
            localStorage.removeItem("shield_jobs");
            setJobs([]);
        }
    };

    const total = jobs.length;
    const open = jobs.filter((j) => j.status === "Open").length;
    const pending = jobs.filter((j) => j.status === "Pending").length;
    const booked = jobs.filter((j) => j.status === "Booked").length;
    const completed = jobs.filter((j) => j.status === "Completed").length;

    const statusStyles: any = {
        Open: "bg-blue-100 text-blue-700",
        Pending: "bg-amber-100 text-amber-700",
        Booked: "bg-purple-100 text-purple-700",
        Completed: "bg-green-100 text-green-700",
    };

    // =====================================================
    // 🚪 Restricted Access Gate
    // =====================================================
    if (!authorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#eef3ff] to-[#f9fbff]">
                <div className="bg-white shadow-lg border border-slate-200 rounded-2xl p-8 w-[340px] text-center">
                    <Shield className="w-8 h-8 mx-auto text-[#2f487d] mb-3" />
                    <h1 className="text-xl font-bold text-[#2f487d] mb-4">
                        Restricted Access
                    </h1>
                    <p className="text-sm text-slate-500 mb-4">
                        Authorized personnel only
                    </p>
                    <input
                        type="password"
                        placeholder="Enter access code"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="border border-slate-300 rounded-full px-4 py-2 w-full mb-4 text-center focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                    <button
                        onClick={handleLogin}
                        className="bg-gradient-to-r from-[#365597] to-[#2f487d] text-white font-semibold px-5 py-2 rounded-full w-full hover:opacity-90 transition"
                    >
                        Enter
                    </button>
                </div>
            </div>
        );
    }

    // =====================================================
    // 🧠 Authorized Dashboard
    // =====================================================
    return (
        <div className="min-h-screen bg-[#f9fbff] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
                    <h1 className="text-xl font-bold text-[#2f487d] flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#365597]" /> System Dashboard
                    </h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium shadow transition"
                        >
                            Reset Jobs
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <main className="max-w-6xl mx-auto w-full flex-1 py-10 px-5">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-extrabold text-[#2f487d] mb-6"
                >
                    System Overview
                </motion.h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Stat label="Total Jobs" value={total} color="text-[#2f487d]" />
                    <Stat label="Open" value={open} color="text-blue-600" />
                    <Stat label="Pending" value={pending} color="text-amber-600" />
                    <Stat label="Booked" value={booked} color="text-purple-600" />
                    <Stat label="Completed" value={completed} color="text-green-600" />
                </div>

                {/* Job List */}
                <div className="space-y-4">
                    {jobs.length === 0 ? (
                        <p className="text-center text-slate-500 italic">
                            No jobs found in the system 🗂️
                        </p>
                    ) : (
                        jobs.map((j) => (
                            <motion.div
                                key={j.id}
                                whileHover={{ y: -3 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                            >
                                <div className="flex flex-col">
                                    <p className="font-semibold text-[#2f487d]">{j.site}</p>
                                    <p className="text-sm text-slate-500">
                                        {j.siteType} • {j.rank} • {j.date} ({j.startTime}–{j.endTime})
                                    </p>
                                    <p className="text-sm text-blue-800 font-medium mt-1">
                                        ${j.offerPay} ({j.urgency})
                                    </p>

                                    <div className="mt-2 space-y-1 text-xs text-slate-500">
                                        {j.agencyReview && (
                                            <p>
                                                ⭐ Reviewed by Agency on{" "}
                                                {new Date(j.agencyReview.timestamp).toLocaleDateString()}
                                            </p>
                                        )}
                                        {j.officerReview && (
                                            <p>
                                                ⭐ Reviewed by Officer on{" "}
                                                {new Date(j.officerReview.timestamp).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[j.status]}`}
                                    >
                                        {j.status}
                                    </span>
                                    <button
                                        onClick={() => {
                                            if (confirm(`Delete job "${j.site}"?`)) {
                                                const updated = jobs.filter((x) => x.id !== j.id);
                                                saveJobs(updated);
                                                setJobs(updated);
                                            }
                                        }}
                                        className="flex items-center gap-1 text-xs bg-rose-100 text-rose-700 px-3 py-1 rounded-full hover:bg-rose-200 transition"
                                    >
                                        <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

function Stat({ label, value, color }: any) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <ClipboardList className="w-5 h-5 mx-auto mb-2 text-slate-400" />
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
    );
}
