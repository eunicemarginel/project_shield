"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CheckCircle2 } from "lucide-react";

export default function AgencyRegisterPage() {
    const [step, setStep] = useState<"plan" | "form" | "done">("plan");
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [form, setForm] = useState({
        agencyName: "",
        uen: "",
        license: "",
        address: "",
        contactPerson: "",
        contactNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    // Handle form field changes
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle registration submit
    const handleSubmit = (e: any) => {
        e.preventDefault();
        setError("");

        // Validation
        for (const key in form) {
            if (!(form as any)[key]) {
                setError("Please fill in all required fields.");
                return;
            }
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!selectedPlan) {
            setError("Please select a subscription plan first.");
            return;
        }

        // Save to localStorage
        const pending = JSON.parse(localStorage.getItem("shield_agencies_pending") || "[]");
        const verified = JSON.parse(localStorage.getItem("shield_agencies_verified") || "[]");

        const exists =
            pending.some((a: any) => a.uen === form.uen || a.license === form.license) ||
            verified.some((a: any) => a.uen === form.uen || a.license === form.license);

        if (exists) {
            setError("An agency with this UEN or License number is already registered.");
            return;
        }

        const newAgency = {
            ...form,
            id: Date.now(),
            plan: selectedPlan,
            status: "PendingValidation",
            createdAt: new Date().toISOString(),
        };

        pending.push(newAgency);
        localStorage.setItem("shield_agencies_pending", JSON.stringify(pending));
        setStep("done");
    };

    // Plans
    const plans = [
        { name: "Free", price: "$0", desc: "2 deployments per month", limit: 2 },
        { name: "Basic", price: "$99", desc: "Up to 20 deployments / month", limit: 20 },
        { name: "Pro", price: "$150", desc: "Up to 35 deployments / month", limit: 35 },
        { name: "Unlimited", price: "$275", desc: "Unlimited deployments", limit: "∞" },
    ];

    return (
        <div className="min-h-screen bg-[#f9fbff] flex flex-col items-center py-10">
            <header className="text-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#365597] to-[#2f487d] flex items-center justify-center shadow-md mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#2f487d]">Agency Registration</h1>
                    <p className="text-slate-600 text-sm mt-1">
                        Register your security agency to start posting deployments.
                    </p>
                </motion.div>
            </header>

            <AnimatePresence mode="wait">
                {step === "plan" && (
                    <motion.div
                        key="plan"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl px-6"
                    >
                        {plans.map((p, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className={`border rounded-2xl p-6 text-center cursor-pointer transition shadow-sm ${selectedPlan === p.name
                                    ? "border-[#2f487d] bg-blue-50"
                                    : "border-slate-200 bg-white"
                                    }`}
                                onClick={() => setSelectedPlan(p.name)}
                            >
                                <h3 className="text-lg font-semibold text-[#2f487d] mb-1">{p.name}</h3>
                                <p className="text-2xl font-bold text-[#2f487d]">{p.price}</p>
                                <p className="text-slate-600 text-sm mt-1">{p.desc}</p>
                            </motion.div>
                        ))}
                        <div className="col-span-full flex justify-center mt-6">
                            <button
                                disabled={!selectedPlan}
                                onClick={() => setStep("form")}
                                className={`px-8 py-2.5 rounded-full text-white font-semibold transition ${selectedPlan
                                    ? "bg-gradient-to-r from-[#365597] to-[#2f487d] hover:opacity-90"
                                    : "bg-slate-300 cursor-not-allowed"
                                    }`}
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === "form" && (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 w-full max-w-md"
                    >
                        <h2 className="text-lg font-semibold text-[#2f487d] mb-3 text-center">
                            {selectedPlan} Plan
                        </h2>
                        <div className="space-y-4">
                            <input type="text" name="agencyName" placeholder="Agency Name" value={form.agencyName} onChange={handleChange} className="input w-full" />
                            <input type="text" name="uen" placeholder="UEN" value={form.uen} onChange={handleChange} className="input w-full" />
                            <input type="text" name="license" placeholder="Security Agency License No." value={form.license} onChange={handleChange} className="input w-full" />
                            <input type="text" name="address" placeholder="Agency Address" value={form.address} onChange={handleChange} className="input w-full" />
                            <input type="text" name="contactPerson" placeholder="Contact Person" value={form.contactPerson} onChange={handleChange} className="input w-full" />
                            <input type="tel" name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} className="input w-full" />
                            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input w-full" />
                            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="input w-full" />
                            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="input w-full" />

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button type="submit" className="w-full bg-gradient-to-r from-[#365597] to-[#2f487d] text-white py-2.5 rounded-full font-semibold hover:opacity-90 transition">
                                Register Agency
                            </button>
                        </div>
                    </motion.form>
                )}

                {step === "done" && (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
                    >
                        <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-[#2f487d]">
                            Registration Received
                        </h3>
                        <p className="text-sm text-slate-600 mt-2">
                            Thank you for registering your agency with Shield Connect. Our team will verify
                            your license and email you within 24 hours once your account is approved.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
