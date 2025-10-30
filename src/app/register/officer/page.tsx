"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function OfficerRegisterPage() {
    const [form, setForm] = useState({
        nric: "",
        dob: "",
        email: "",
        mobile: "",
        address: "",
        password: "",
        confirmPassword: "",
    });
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setError("");

        // simple validation
        if (
            !form.nric ||
            !form.dob ||
            !form.email ||
            !form.mobile ||
            !form.address ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const pending = JSON.parse(localStorage.getItem("shield_officers_pending") || "[]");
        const verified = JSON.parse(localStorage.getItem("shield_officers_verified") || "[]");

        const exists =
            pending.some((o: any) => o.nric === form.nric) ||
            verified.some((o: any) => o.nric === form.nric);

        if (exists) {
            setError("This NRIC is already registered.");
            return;
        }

        const newOfficer = {
            ...form,
            id: Date.now(),
            status: "PendingValidation",
            createdAt: new Date().toISOString(),
        };

        pending.push(newOfficer);
        localStorage.setItem("shield_officers_pending", JSON.stringify(pending));

        setShowModal(true);
        setForm({
            nric: "",
            dob: "",
            email: "",
            mobile: "",
            address: "",
            password: "",
            confirmPassword: "",
        });
    };

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
                    <h1 className="text-2xl font-bold text-[#2f487d]">
                        Officer Registration
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                        Join Shield Connect and start receiving deployment offers.
                    </p>
                </motion.div>
            </header>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 w-full max-w-md"
            >
                <div className="space-y-4">
                    <input
                        type="text"
                        name="nric"
                        placeholder="NRIC"
                        value={form.nric}
                        onChange={handleChange}
                        className="input w-full"
                    />
                    <input
                        type="date"
                        name="dob"
                        placeholder="Date of Birth"
                        value={form.dob}
                        onChange={handleChange}
                        className="input w-full"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="input w-full"
                    />
                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={form.mobile}
                        onChange={handleChange}
                        className="input w-full"
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Residential Address"
                        value={form.address}
                        onChange={handleChange}
                        className="input w-full"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="input w-full"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="input w-full"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#365597] to-[#2f487d] text-white py-2.5 rounded-full font-semibold hover:opacity-90 transition"
                    >
                        Register
                    </button>

                    <p className="text-xs text-center text-slate-500 mt-3">
                        Already have an account?{" "}
                        <Link href="/login/officer" className="text-[#2f487d] font-semibold">
                            Login
                        </Link>
                    </p>
                </div>
            </form>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
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
                            className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-sm"
                        >
                            <ShieldCheck className="w-10 h-10 text-green-600 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-[#2f487d]">
                                Registration Received
                            </h3>
                            <p className="text-sm text-slate-600 mt-2">
                                Thank you for joining Shield Connect. We’ll verify your license and
                                contact you via email within 24 hours.
                            </p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-5 bg-gradient-to-r from-[#365597] to-[#2f487d] text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
                            >
                                Got it
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
