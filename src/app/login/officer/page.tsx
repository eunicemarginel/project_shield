"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, LogOut, Briefcase, Star } from "lucide-react";
import Link from "next/link";

// ===== Helper functions for localStorage Jobs =====
const getJobs = () => JSON.parse(localStorage.getItem("shield_jobs") || "[]");
const updateJob = (id: number, updates: any) => {
    const jobs = getJobs();
    const idx = jobs.findIndex((j: any) => j.id === id);
    if (idx !== -1) {
        jobs[idx] = { ...jobs[idx], ...updates };
        localStorage.setItem("shield_jobs", JSON.stringify(jobs));
    }
};

export default function OfficerLoginPage() {
    const [nric, setNric] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [officer, setOfficer] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [now, setNow] = useState(Date.now());

    // review modal state
    const [showReview, setShowReview] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [traits, setTraits] = useState<string[]>([]);
    const [comments, setComments] = useState("");

    // 🧠 Auto-login from localStorage
    useEffect(() => {
        const savedOfficer = localStorage.getItem("shield_logged_officer");
        if (savedOfficer) {
            setOfficer(JSON.parse(savedOfficer));
        }

        setJobs(getJobs());
        const sync = () => setJobs(getJobs());
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 30 * 1000);
        return () => clearInterval(interval);
    }, []);

    // 🔐 Handle Login
    const handleLogin = () => {
        setError("");
        const validated = JSON.parse(localStorage.getItem("shield_officers_validated") || "[]");
        const pending = JSON.parse(localStorage.getItem("shield_officers_pending") || "[]");

        const foundValidated = validated.find((o: any) => o.nric === nric && o.email === email && o.password === password);
        const foundPending = pending.find((o: any) => o.nric === nric && o.email === email);

        if (foundValidated) {
            localStorage.setItem("shield_logged_officer", JSON.stringify(foundValidated));
            setOfficer(foundValidated);
        } else if (foundPending) {
            setError("We are in the midst of validating your registration. You will receive an email once your account is ready.");
        } else {
            setError("Invalid login credentials. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("shield_logged_officer");
        setOfficer(null);
        setNric("");
        setEmail("");
        setPassword("");
    };

    // ===== Job Logic =====
    const handleCommit = (id: number) => {
        updateJob(id, { status: "Pending", commitTime: Date.now() });
        setJobs(getJobs());
    };

    const handleCancel = (id: number) => {
        updateJob(id, { status: "Open", commitTime: null });
        setJobs(getJobs());
    };

    const handleReviewSubmit = () => {
        if (!selectedJob) return;
        updateJob(selectedJob.id, {
            officerReview: {
                rating,
                traits,
                comments,
                timestamp: Date.now(),
            },
        });
        setJobs(getJobs());
        setShowReview(false);
        setSelectedJob(null);
        setRating(0);
        setTraits([]);
        setComments("");
    };

    const getRemaining = (commitTime: number) => {
        const diff = 30 * 60 * 1000 - (now - commitTime);
        if (diff <= 0) return "now";
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        return `${mins}m ${secs}s`;
    };

    const toggleTrait = (t: string) => {
        setTraits((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
    };

    const traitOptions = ["Clear Instructions", "Good Communication", "Respectful", "Efficient Process", "Fair Pay"];

    const statusStyles: any = {
        Open: "bg-blue-100 text-blue-700",
        Pending: "bg-amber-100 text-amber-700",
        Booked: "bg-purple-100 text-purple-700",
        Completed: "bg-green-100 text-green-700",
    };

    // =====================================================
    // 💻 Render Section
    // =====================================================
    return (
        <div className="min-h-screen bg-[#f9fbff] flex flex-col items-center py-10">
            {/* Header */}
            <header className="text-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#365597] to-[#2f487d] flex items-center justify-center shadow-md mb-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#2f487d]">Officer Dashboard</h1>
                    <p className="text-slate-600 text-sm mt-1">
                        Log in to manage your deployments and job offers.
                    </p>
                </motion.div>
            </header>

            {/* Login Form */}
            {!officer ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                    className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 w-full max-w-md"
                >
                    <div className="space-y-4">
                        <input type="text" placeholder="NRIC" value={nric} onChange={(e) => setNric(e.target.value)} className="input w-full" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input w-full" />

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#365597] to-[#2f487d] text-white py-2.5 rounded-full font-semibold hover:opacity-90 transition"
                        >
                            Login
                        </button>

                        <p className="text-xs text-center text-slate-500 mt-3">
                            Don’t have an account?{" "}
                            <Link href="/register/officer" className="text-[#2f487d] font-semibold">
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            ) : (
                <div className="w-full max-w-4xl">
                    {/* Officer Profile */}
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-[#2f487d]">Welcome, {officer.name || "Officer"}</h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    Rank: {officer.rank || "—"} • License: {officer.licenseNumber || "—"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Notifications: {officer.notifications ?? 0}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm flex items-center gap-1"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    </div>

                    {/* Available Jobs */}
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
                        <h3 className="text-lg font-semibold text-[#2f487d] flex items-center gap-2 mb-3">
                            <Briefcase className="w-5 h-5 text-[#365597]" /> Available Jobs
                        </h3>

                        {jobs.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">No available jobs at the moment 🚧</p>
                        ) : (
                            <div className="space-y-3">
                                {jobs.map((j: any) => {
                                    const canCancel = j.status === "Pending" && j.commitTime && now - j.commitTime > 30 * 60 * 1000;

                                    return (
                                        <motion.div
                                            key={j.id}
                                            whileHover={{ y: -2 }}
                                            className="p-4 border border-slate-200 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition"
                                        >
                                            <div>
                                                <p className="font-semibold text-[#2f487d]">{j.site}</p>
                                                <p className="text-sm text-slate-500">
                                                    {j.siteType} • {j.rank} • {j.date} ({j.startTime}–{j.endTime})
                                                </p>
                                                <p className="text-sm text-green-700 font-medium">
                                                    ${j.offerPay} ({j.urgency})
                                                </p>

                                                {j.status === "Pending" &&
                                                    j.commitTime &&
                                                    now - j.commitTime < 30 * 60 * 1000 && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            ⏳ Awaiting agency confirmation — can cancel in {getRemaining(j.commitTime)}
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[j.status]}`}>
                                                    {j.status}
                                                </span>

                                                {j.status === "Open" && (
                                                    <button
                                                        onClick={() => handleCommit(j.id)}
                                                        className="bg-gradient-to-r from-[#365597] to-[#2f487d] hover:opacity-90 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow"
                                                    >
                                                        Commit
                                                    </button>
                                                )}

                                                {canCancel && (
                                                    <button
                                                        onClick={() => handleCancel(j.id)}
                                                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}

                                                {j.status === "Completed" && !j.officerReview && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedJob(j);
                                                            setShowReview(true);
                                                        }}
                                                        className="bg-blue-50 text-[#2f487d] border border-blue-100 px-4 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition"
                                                    >
                                                        Review this Job
                                                    </button>
                                                )}
                                                {j.officerReview && (
                                                    <span className="text-xs text-green-700 font-medium">Reviewed</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ⭐ Review Modal */}
            <AnimatePresence>
                {showReview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-[#2f487d] mb-3">
                                Review This Deployment
                            </h3>

                            <div className="flex gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <Star
                                        key={n}
                                        onClick={() => setRating(n)}
                                        className={`w-7 h-7 cursor-pointer ${n <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
                                            }`}
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-slate-600 mb-2">Feedback Tags:</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {traitOptions.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => toggleTrait(t)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${traits.includes(t)
                                            ? "bg-blue-100 border-blue-400 text-blue-800"
                                            : "bg-white border-slate-300 text-slate-500"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                placeholder="Add feedback about the deployment..."
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="w-full border border-slate-300 rounded-xl p-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                rows={3}
                            />

                            <div className="flex justify-end gap-3 mt-5">
                                <button
                                    onClick={() => {
                                        setShowReview(false);
                                        setSelectedJob(null);
                                    }}
                                    className="px-4 py-2 text-sm rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleReviewSubmit}
                                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#365597] to-[#2f487d] text-white text-sm font-semibold hover:opacity-90 shadow"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
