"use client";
import { useEffect, useState } from "react";
import { getJobs, addJob, updateJob } from "@/lib/dataStore";
import { Briefcase, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AgencyPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [site, setSite] = useState("");
    const [siteType, setSiteType] = useState("Commercial");
    const [rank, setRank] = useState("SO");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [urgency, setUrgency] = useState("Normal");
    const [suggestedPay, setSuggestedPay] = useState(0);
    const [offerPay, setOfferPay] = useState("");
    const [error, setError] = useState("");

    // review modal state
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

    useEffect(() => setJobs(getJobs()), []);
    useEffect(() => {
        const sync = () => setJobs(getJobs());
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, []);

    useEffect(() => {
        if (!startTime || !endTime) return;
        const [startH] = startTime.split(":").map(Number);
        const [endH] = endTime.split(":").map(Number);
        let hours = endH - startH;
        if (hours < 0) hours += 24;
        const base = pwmRates[rank] * hours;
        const multiplier = urgency === "Rush" ? 1.2 : 1;
        setSuggestedPay(+(base * multiplier).toFixed(2));
    }, [rank, startTime, endTime, urgency]);

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
        addJob(site, date, {
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
        });
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

    const handleComplete = (job: any) => {
        updateJob(job.id, { status: "Completed" });
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
        setTraits((prev) =>
            prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
        );
    };

    const statusStyles: any = {
        Open: "bg-blue-100 text-blue-700",
        Pending: "bg-amber-100 text-amber-700",
        Booked: "bg-purple-100 text-purple-700",
        Completed: "bg-green-100 text-green-700",
    };

    const traitOptions = [
        "Punctual",
        "Well Groomed",
        "Polite",
        "Alert",
        "Team Player",
    ];

    function markCompleted(id: number) {
        const job = jobs.find((j) => j.id === id);
        if (!job) return;

        // mark job as completed
        updateJob(id, { status: "Completed" });

        // refresh local state
        setJobs(getJobs());
    }

    return (
        <div className="min-h-screen bg-[#f9fbff] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
                    <h1 className="text-xl font-bold text-[#2f487d] flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-[#365597]" /> Shield Agency
                    </h1>
                    <a
                        href="/"
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-[#365597] to-[#2f487d] text-white text-sm font-medium shadow hover:shadow-md transition"
                    >
                        Home
                    </a>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-5xl mx-auto w-full flex-1 py-10 px-5">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-extrabold text-[#2f487d] mb-6"
                >
                    Agency Dashboard
                </motion.h2>

                {/* Post Job Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 mb-8"
                >
                    <h3 className="text-lg font-semibold text-[#2f487d] mb-4">
                        Post New Deployment
                    </h3>

                    {/* form fields */}
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
                        {urgency === "Rush" && (
                            <span className="text-amber-600 ml-2">(includes rush bonus)</span>
                        )}
                    </div>

                    {error && <p className="text-red-600 mt-3 font-medium text-sm">{error}</p>}

                    <button onClick={handleAddJob} className="mt-5 bg-gradient-to-r from-[#365597] to-[#2f487d] hover:opacity-90 text-white px-8 py-2.5 rounded-full shadow-md transition font-semibold">
                        Add Job
                    </button>
                </motion.div>

                {/* Job List */}
                <div className="space-y-4">
                    {jobs.length === 0 ? (
                        <p className="text-center text-slate-500 italic">
                            No job postings yet — start by adding one 💼
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

                                    {/* review tags */}
                                    <div className="mt-2 space-y-1 text-xs text-slate-500">
                                        {j.agencyReview && (
                                            <p>⭐ Reviewed by Agency on {new Date(j.agencyReview.timestamp).toLocaleDateString()}</p>
                                        )}
                                        {j.officerReview && (
                                            <p>⭐ Reviewed by Officer on {new Date(j.officerReview.timestamp).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[j.status]}`}>
                                        {j.status}
                                    </span>

                                    {j.status === "Pending" && (
                                        <button
                                            onClick={() => handleAccept(j.id)}
                                            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 text-white px-4 py-1.5 rounded-full text-xs font-semibold"
                                        >
                                            Accept
                                        </button>
                                    )}

                                    {j.status === "Booked" && (
                                        <button
                                            onClick={() => markCompleted(j.id)}
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white px-4 py-1.5 rounded-full text-xs font-semibold"
                                        >
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
                        ))
                    )}
                </div>
            </main>

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
                                Review Officer
                            </h3>
                            <div className="flex gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <Star
                                        key={n}
                                        onClick={() => setRating(n)}
                                        className={`w-7 h-7 cursor-pointer ${n <= rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-slate-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">Commendable traits:</p>
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
