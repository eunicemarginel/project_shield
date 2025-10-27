"use client";
import { useEffect, useState } from "react";
import { getJobs, updateJob } from "@/lib/dataStore";
import { ShieldCheck, Briefcase, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfficerPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [now, setNow] = useState(Date.now());

    // review modal state
    const [showReview, setShowReview] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [traits, setTraits] = useState<string[]>([]);
    const [comments, setComments] = useState("");

    useEffect(() => {
        setJobs(getJobs());
        const sync = () => setJobs(getJobs());
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 30 * 1000);
        return () => clearInterval(interval);
    }, []);

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
        "Clear Instructions",
        "Good Communication",
        "Respectful",
        "Efficient Process",
        "Fair Pay",
    ];

    return (
        <div className="min-h-screen bg-[#f9fbff] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
                    <h1 className="text-xl font-bold text-[#2f487d] flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#365597]" /> Shield Officer
                    </h1>
                    <a
                        href="/"
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-[#365597] to-[#2f487d] text-white text-sm font-medium shadow hover:shadow-md transition"
                    >
                        Home
                    </a>
                </div>
            </header>

            <main className="max-w-5xl mx-auto w-full flex-1 py-10 px-5">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-extrabold text-[#2f487d] mb-6"
                >
                    Available Deployments
                </motion.h2>

                <div className="space-y-4">
                    {jobs.length === 0 ? (
                        <p className="text-center text-slate-500 italic">
                            No jobs available nearby 💤
                        </p>
                    ) : (
                        jobs.map((j) => {
                            const canCancel =
                                j.status === "Pending" &&
                                j.commitTime &&
                                now - j.commitTime > 30 * 60 * 1000;

                            return (
                                <motion.div
                                    key={j.id}
                                    whileHover={{ y: -3 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center"
                                >
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-[#365597]" />
                                            <p className="font-semibold text-[#2f487d]">{j.site}</p>
                                        </div>

                                        <p className="text-sm text-slate-500">
                                            {j.siteType} • {j.rank} • {j.date} ({j.startTime}–{j.endTime})
                                        </p>
                                        <p className="text-sm text-blue-800 font-medium mt-1">
                                            ${j.offerPay} ({j.urgency})
                                        </p>

                                        {/* Reviews display */}
                                        {j.agencyReview && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                ⭐ Reviewed by Agency on{" "}
                                                {new Date(j.agencyReview.timestamp!).toLocaleDateString()}
                                            </p>
                                        )}
                                        {j.officerReview && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                ⭐ Reviewed by Officer on{" "}
                                                {new Date(j.officerReview.timestamp!).toLocaleDateString()}
                                            </p>
                                        )}

                                        {j.status === "Pending" &&
                                            j.commitTime &&
                                            now - j.commitTime < 30 * 60 * 1000 && (
                                                <p className="text-xs text-slate-500 mt-1">
                                                    ⏳ Awaiting agency confirmation — can cancel in{" "}
                                                    {getRemaining(j.commitTime)}
                                                </p>
                                            )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[j.status]}`}
                                        >
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

                                        {j.status === "Booked" && (
                                            <span className="text-green-700 text-sm font-medium">
                                                Confirmed
                                            </span>
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
                        })
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
                                Review This Deployment
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
