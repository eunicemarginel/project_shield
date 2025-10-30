"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Shield,
    Users,
    Building2,
    CheckCircle2,
    ClipboardList,
    Trash2,
    LogOut,
} from "lucide-react";
import { AlertCircle } from "lucide-react";


export default function SystemDashboard() {
    const [authorized, setAuthorized] = useState(false);
    const [input, setInput] = useState("");
    const [jobs, setJobs] = useState<any[]>([]);
    const [pendingOfficers, setPendingOfficers] = useState<any[]>([]);
    const [validatedOfficers, setValidatedOfficers] = useState<any[]>([]);
    const [pendingAgencies, setPendingAgencies] = useState<any[]>([]);
    const [validatedAgencies, setValidatedAgencies] = useState<any[]>([]);

    // Auto-login check
    useEffect(() => {
        const savedAuth = localStorage.getItem("shield_admin_auth");
        if (savedAuth === "granted") setAuthorized(true);
    }, []);

    // Load all data once authorized
    // Load all data once authorized
    useEffect(() => {
        if (authorized) {
            const jobsData = JSON.parse(localStorage.getItem("shield_jobs") || "[]");
            const officersPending = JSON.parse(localStorage.getItem("shield_officers_pending") || "[]");
            const officersValidated = JSON.parse(localStorage.getItem("shield_officers_validated") || "[]");
            const agenciesPending = JSON.parse(localStorage.getItem("shield_agencies_pending") || "[]");
            const agenciesValidated = JSON.parse(localStorage.getItem("shield_agencies_validated") || "[]");

            setJobs(jobsData);
            setPendingOfficers(officersPending);
            setValidatedOfficers(officersValidated);
            setPendingAgencies(agenciesPending);
            setValidatedAgencies(agenciesValidated);
        }
    }, [authorized]);

    // 🧠 Live sync for jobs and statuses
    useEffect(() => {
        if (!authorized) return;

        const load = () => {
            const jobsData = JSON.parse(localStorage.getItem("shield_jobs") || "[]");
            setJobs(jobsData);
        };

        load(); // initial
        window.addEventListener("storage", load); // sync when other tabs/pages change jobs
        const interval = setInterval(load, 2000); // refresh every 2s just in case
        return () => {
            window.removeEventListener("storage", load);
            clearInterval(interval);
        };
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
        if (confirm("⚠️ Clear all jobs from local storage?")) {
            localStorage.removeItem("shield_jobs");
            setJobs([]);
        }
    };

    const handleDeleteJob = (id: number) => {
        if (confirm("🗑️ Delete this job posting?")) {
            const updated = jobs.filter((j) => j.id !== id);
            localStorage.setItem("shield_jobs", JSON.stringify(updated));
            setJobs(updated);
        }
    };

    if (!authorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#eef3ff] to-[#f9fbff]">
                <div className="bg-white shadow-lg border border-slate-200 rounded-2xl p-8 w-[340px] text-center">
                    <Shield className="w-8 h-8 mx-auto text-[#2f487d] mb-3" />
                    <h1 className="text-xl font-bold text-[#2f487d] mb-4">Restricted Access</h1>
                    <p className="text-sm text-slate-500 mb-4">Authorized personnel only</p>
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
                            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium flex items-center gap-1 transition"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Summary */}
            <main className="max-w-6xl mx-auto w-full flex-1 py-10 px-5">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-extrabold text-[#2f487d] mb-6"
                >
                    System Overview
                </motion.h2>

                {/* Top Stats */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Stat label="Jobs Posted" value={jobs.length} color="text-[#2f487d]" icon={<ClipboardList className="w-5 h-5 text-slate-500" />} />
                    <Stat label="Officers Pending" value={pendingOfficers.length} color="text-amber-600" icon={<Users className="w-5 h-5 text-slate-500" />} />
                    <Stat label="Agencies Pending" value={pendingAgencies.length} color="text-blue-600" icon={<Building2 className="w-5 h-5 text-slate-500" />} />
                    <Stat label="Total Validated" value={validatedOfficers.length + validatedAgencies.length} color="text-green-600" icon={<CheckCircle2 className="w-5 h-5 text-slate-500" />} />
                </div>

                {/* Validation Panels */}
                <section className="space-y-6">
                    <DashboardLink
                        title={
                            <>
                                <span className="inline-flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                    Officers Pending Verification
                                </span>
                            </>
                        }
                        desc="Review and approve new security officer registrations."
                        href="/system-dashboard/officers"
                        count={pendingOfficers.length}
                        color="border-amber-300"
                    />

                    <DashboardLink
                        title={
                            <>
                                <span className="inline-flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                    Agencies Pending Verification
                                </span>
                            </>
                        }
                        desc="Validate newly registered security agencies."
                        href="/system-dashboard/agencies"
                        count={pendingAgencies.length}
                        color="border-amber-300"
                    />
                    <DashboardLink
                        title={
                            <>
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    Verified Officers
                                </span>
                            </>
                        }
                        desc="View all officers who have been approved."
                        href="/system-dashboard/officers/validated"
                        count={validatedOfficers.length}
                        color="border-green-300"
                    />

                    <DashboardLink
                        title={
                            <>
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    Verified Agencies
                                </span>
                            </>
                        }
                        desc="List of all verified security agencies."
                        href="/system-dashboard/agencies/validated"
                        count={validatedAgencies.length}
                        color="border-green-300"
                    />
                </section>

                {/* Job List */}
                <section className="mt-10">
                    <h3 className="text-lg font-semibold text-[#2f487d] mb-3 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-[#2f487d]" /> Recent Job Posts
                    </h3>
                    {jobs.length === 0 ? (
                        <p className="text-slate-500 italic">No job postings available yet 🗂️</p>
                    ) : (
                        <div className="space-y-3">
                            {jobs.slice(-5).reverse().map((j, i) => (
                                <div
                                    key={i}
                                    className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:shadow-md transition"
                                >
                                    <div>
                                        <p className="font-semibold text-[#2f487d]">{j.site}</p>
                                        <p className="text-sm text-slate-500">
                                            {j.rank} • {j.date} ({j.startTime}–{j.endTime})
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Status: <span className="font-medium text-[#2f487d]">{j.status || "Open"}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                        <span className="text-sm text-green-700 font-medium">${j.offerPay}</span>
                                        <button
                                            onClick={() => handleDeleteJob(j.id)}
                                            className="p-2 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition"
                                            title="Delete job"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

// ===== Helper Components =====

function Stat({ label, value, color, icon }: any) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="flex justify-center mb-2">{icon}</div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
    );
}

function DashboardLink({ title, desc, href, count, color }: any) {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className={`bg-white p-5 rounded-2xl shadow-sm border ${color} flex justify-between items-center`}
        >
            <div>
                <h3 className="font-semibold text-[#2f487d]">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="bg-[#f9fbff] border border-slate-200 px-3 py-1 rounded-full text-sm text-slate-600 font-medium">
                    {count}
                </span>
                <Link
                    href={href}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-[#365597] to-[#2f487d] text-white rounded-full font-medium hover:opacity-90 transition"
                >
                    View
                </Link>
            </div>
        </motion.div>
    );
}
