"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, LogOut, Briefcase, AlertTriangle, Star } from "lucide-react";
import Link from "next/link";

// ===== helper dataStore functions =====
const getJobs = () => JSON.parse(localStorage.getItem("shield_jobs") || "[]");
const addJob = (job: any) => {
    const jobs = getJobs();
    localStorage.setItem("shield_jobs", JSON.stringify([...jobs, job]));
};
const updateJob = (id: number, updates: any) => {
    const jobs = getJobs();
    const idx = jobs.findIndex((j: any) => j.id === id);
    if (idx !== -1) {
        jobs[idx] = { ...jobs[idx], ...updates };
        localStorage.setItem("shield_jobs", JSON.stringify(jobs));
    }
};

export default function AgencyLoginPage() {
    const [uen, setUen] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [agency, setAgency] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [showPendingModal, setShowPendingModal] = useState(false);

    // 🧮 posting fields
    const [site, setSite] = useState("");
    const [siteType, setSiteType] = useState("Commercial");
    const [rank, setRank] = useState("SO");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [urgency, setUrgency] = useState("Normal");
    const [offerPay, setOfferPay] = useState("");
    const [suggestedPay, setSuggestedPay] = useState(0);

    // ⭐ review modal
    const [showReview, setShowReview] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [traits, setTraits] = useState<string[]>([]);
    const [comments, setComments] = useState("");

    const pwmRates: Record<string, number> = {
        SO: 12.5,
        SSO: 13.5,
        SS: 15,
        SSS: 16.5,
        CSO: 18,
    };

    // 🧠 auto-login + load jobs
    useEffect(() => {
        const savedAgency = localStorage.getItem("shield_logged_agency");
        if (savedAgency) setAgency(JSON.parse(savedAgency));
        setJobs(getJobs());
        const sync = () => setJobs(getJobs());
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, []);

    // 💰 compute suggested pay
    useEffect(() => {
        if (!startTime || !endTime) return;
        const [sH] = startTime.split(":").map(Number);
        const [eH] = endTime.split(":").map(Number);
        let hours = eH - sH;
        if (hours < 0) hours += 24;
        const base = pwmRates[rank] * hours;
        const multiplier = urgency === "Rush" ? 1.2 : 1;
        setSuggestedPay(+(base * multiplier).toFixed(2));
    }, [rank, startTime, endTime, urgency]);

    // ===== login logic =====
    const handleLogin = (e: any) => {
        e.preventDefault();
        setError("");

        const pending = JSON.parse(localStorage.getItem("shield_agencies_pending") || "[]");
        const validated = JSON.parse(localStorage.getItem("shield_agencies_validated") || "[]");

        const agencyPending = pending.find((a: any) => a.uen === uen);
        const agencyValidated = validated.find((a: any) => a.uen === uen);

        if (agencyPending) {
            setShowPendingModal(true);
            return;
        }

        if (agencyValidated) {
            if (agencyValidated.password === password) {
                localStorage.setItem("shield_logged_agency", JSON.stringify(agencyValidated));
                setAgency(agencyValidated);
                return;
            } else {
                setError("Incorrect password. Please try again.");
                return;
            }
        }

        setError("Account not found. Please register first.");
    };

    const handleLogout = () => {
        localStorage.removeItem("shield_logged_agency");
        setAgency(null);
        setUen("");
        setPassword("");
    };

    // ===== deployment actions =====
    const handleAddJob = () => {
        setError("");
        if (!site || !date || !startTime || !endTime || !offerPay) {
            setError("Please fill all required fields.");
            return;
        }
        const minPay = suggestedPay / (urgency === "Rush" ? 1.2 : 1);
        if (Number(offerPay) < minPay) {
            setError(`Pay must be at least $${minPay.toFixed(2)}.`);
            return;
        }

        const newJob = {
            id: Date.now(),
            site,
            siteType,
            date,
            rank,
            startTime,
            endTime,
            urgency,
            suggestedPay,
            offerPay,
            status: "Open",
        };
        addJob(newJob);
        setJobs(getJobs());
        setSite("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setOfferPay("");
    };

    const handleAccept = (id: number) => {
        updateJob(id, { status: "Booked" });
        setJobs(getJobs());
    };

    const markCompleted = (id: number) => {
        const job = jobs.find((j) => j.id === id);
        if (!job) return;
        updateJob(id, { status: "Completed" });
        setJobs(getJobs());
        setSelectedJob(job);
        setShowReview(true);
    };

    const handleReviewSubmit = () => {
        updateJob(selectedJob.id, {
            agencyReview: {
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

    const toggleTrait = (t: string) => {
        setTraits((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
    };

    const traitOptions = ["Punctual", "Well Groomed", "Polite", "Alert", "Team Player"];

    const statusStyles: any = {
        Open: "bg-blue-100 text-blue-700",
        Pending: "bg-amber-100 text-amber-700",
        Booked: "bg-purple-100 text-purple-700",
        Completed: "bg-green-100 text-green-700",
    };

    // =====================================================
    // 💻 render section
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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2f487d] to-[#1e3164] flex items-center justify-center shadow-md mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#2f487d]">Agency Dashboard</h1>
                    <p className="text-slate-600 text-sm mt-1">
                        Log in to manage your deployments and officer bookings.
                    </p>
                </motion.div>
            </header>

            {!agency ? (
                // ===== Login Form =====
                <form onSubmit={handleLogin} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 w-full max-w-md">
                    <div className="space-y-4">
                        <input type="text" placeholder="UEN" value={uen} onChange={(e) => setUen(e.target.value)} className="input w-full" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input w-full" />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="w-full bg-gradient-to-r from-[#2f487d] to-[#1e3164] text-white py-2.5 rounded-full font-semibold hover:opacity-90 transition">
                            Login
                        </button>
                        <p className="text-xs text-center text-slate-500 mt-3">
                            Don’t have an account?{" "}
                            <Link href="/register/agency" className="text-[#2f487d] font-semibold">Register</Link>
                        </p>
                    </div>
                </form>
            ) : (
                // ===== Dashboard =====
                <div className="w-full max-w-4xl">
                    {/* Profile */}
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-[#2f487d]">Welcome, {agency.agencyName || "Agency"}</h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    UEN: {agency.uen || "—"} • License: {agency.license || "—"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Plan: {agency.plan || "Free"} • Contact: {agency.contactPerson || "—"} ({agency.contactNumber || "—"})
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

                    {/* Post New Deployment */}
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-[#2f487d] mb-4">Post New Deployment</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input type="text" placeholder="Site name" value={site} onChange={(e) => setSite(e.target.value)} className="input" />
                            <select value={siteType} onChange={(e) => setSiteType(e.target.value)} className="input">
                                <option>Commercial</option>
                                <option>Residential</option>
                                <option>Event</option>
                                <option>Construction</option>
                                <option>Others</option>
                            </select>
                            <select value={rank} onChange={(e) => setRank(e.target.value)} className="input">
                                <option value="SO">Security Officer (SO)</option>
                                <option value="SSO">Senior Security Officer (SSO)</option>
                                <option value="SS">Security Supervisor (SS)</option>
                                <option value="SSS">Senior Security Supervisor (SSS)</option>
                                <option value="CSO">Chief Security Officer (CSO)</option>
                            </select>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
                            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input" />
                            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input" />
                            <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="input">
                                <option value="Normal">Normal</option>
                                <option value="Rush">Rush (Last-Minute)</option>
                            </select>
                            <input type="number" placeholder="Offer pay ($)" value={offerPay} onChange={(e) => setOfferPay(e.target.value)} className="input" />
                        </div>

                        <div className="mt-4 text-sm text-slate-600 bg-blue-50 border border-blue-100 rounded-xl p-3">
                            💰 <strong>Suggested Pay:</strong> ${suggestedPay.toFixed(2)}{" "}
                            {urgency === "Rush" && <span className="text-amber-600 ml-2">(includes rush bonus)</span>}
                        </div>
                        {error && <p className="text-red-600 mt-3 font-medium text-sm">{error}</p>}
                        <button onClick={handleAddJob} className="mt-5 bg-gradient-to-r from-[#365597] to-[#2f487d] hover:opacity-90 text-white px-8 py-2.5 rounded-full shadow-md transition font-semibold">
                            Add Job
                        </button>
                    </div>

                    {/* Job List */}
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
                        <h3 className="text-lg font-semibold text-[#2f487d] flex items-center gap-2 mb-3">
                            <Briefcase className="w-5 h-5 text-[#365597]" /> Posted Deployments
                        </h3>

                        {jobs.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">No deployments yet 🚧</p>
                        ) : (
                            <div className="space-y-3">
                                {jobs.map((j) => (
                                    <motion.div key={j.id} whileHover={{ y: -2 }} className="p-4 border border-slate-200 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition">
                                        <div>
                                            <p className="font-semibold text-[#2f487d]">{j.site}</p>
                                            <p className="text-sm text-slate-500">
                                                {j.siteType} • {j.rank} • {j.date} ({j.startTime}–{j.endTime})
                                            </p>
                                            <p className="text-sm text-green-700 font-medium">${j.offerPay} ({j.urgency})</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[j.status]}`}>{j.status}</span>

                                            {j.status === "Pending" && (
                                                <button onClick={() => handleAccept(j.id)} className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                                                    Accept
                                                </button>
                                            )}

                                            {j.status === "Booked" && (
                                                <button onClick={() => markCompleted(j.id)} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                                                    Complete
                                                </button>
                                            )}

                                            {j.status === "Completed" && !j.agencyReview && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedJob(j);
                                                        setShowReview(true);
                                                    }}
                                                    className="bg-blue-50 text-[#2f487d] border border-blue-100 px-4 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition"
                                                >
                                                    Review Officer
                                                </button>
                                            )}

                                            {j.status === "Completed" && j.agencyReview && (
                                                <span className="text-xs text-green-700 font-medium">Reviewed</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ⭐ Review Modal */}
            <AnimatePresence>
                {showReview && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-[#2f487d] mb-3">Review Officer</h3>
                            <div className="flex gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <Star
                                        key={n}
                                        onClick={() => setRating(n)}
                                        className={`w-7 h-7 cursor-pointer ${n <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">Commendable traits:</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {traitOptions.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => toggleTrait(t)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${traits.includes(t) ? "bg-blue-100 border-blue-400 text-blue-800" : "bg-white border-slate-300 text-slate-500"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                placeholder="Add specific feedback..."
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
