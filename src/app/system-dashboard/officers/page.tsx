"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Officer {
    nric: string;
    name?: string;
    email?: string;
    mobile?: string;
    address?: string;
    dob?: string;
    rank?: string;
    licenseNumber?: string;
    licenseExpiry?: string;
    trained?: boolean;
    password?: string;
    notifications?: number;
}

export default function PendingOfficersPage() {
    const [officers, setOfficers] = useState<Officer[]>([]);

    useEffect(() => {
        const list = JSON.parse(
            localStorage.getItem("shield_officers_pending") || "[]"
        );
        setOfficers(list);
    }, []);

    const handleValidate = (index: number) => {
        const officer = officers[index];

        // simple check
        if (!officer.rank || !officer.licenseNumber || !officer.licenseExpiry) {
            alert("⚠️ Please fill in all required validation details first.");
            return;
        }

        // Move to validated list
        const validatedList =
            JSON.parse(localStorage.getItem("shield_officers_validated") || "[]") || [];
        validatedList.push({
            ...officer,
            validatedAt: new Date().toISOString(),
        });
        localStorage.setItem(
            "shield_officers_validated",
            JSON.stringify(validatedList)
        );

        // Remove from pending list
        const updated = officers.filter((_, i) => i !== index);
        setOfficers(updated);
        localStorage.setItem("shield_officers_pending", JSON.stringify(updated));

        alert(`✅ Officer ${officer.name || officer.nric} has been validated.`);
    };

    const handleReject = (index: number) => {
        if (!confirm("Are you sure you want to reject this registration?")) return;
        const updated = officers.filter((_, i) => i !== index);
        setOfficers(updated);
        localStorage.setItem("shield_officers_pending", JSON.stringify(updated));
    };

    const updateField = (index: number, field: keyof Officer, value: any) => {
        const updated = [...officers];
        // @ts-ignore
        updated[index][field] = value;
        setOfficers(updated);
        localStorage.setItem("shield_officers_pending", JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-[#f9fbff]">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
                    <h1 className="text-xl font-bold text-[#2f487d] flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-[#365597]" /> Pending Officers
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
                        No pending officer registrations 💤
                    </p>
                ) : (
                    <div className="space-y-5">
                        {officers.map((o, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.05 }}
                                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                            >
                                <div className="mb-3">
                                    <h3 className="font-semibold text-[#2f487d] mb-1">
                                        NRIC: {o.nric}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        DOB: {o.dob || "—"} | Email: {o.email || "—"} | Mobile:{" "}
                                        {o.mobile || "—"}
                                    </p>
                                </div>

                                {/* Officer Name */}
                                <div className="mb-4">
                                    <label className="text-xs font-semibold text-slate-500">
                                        Officer Name
                                    </label>
                                    <input
                                        type="text"
                                        value={o.name || ""}
                                        onChange={(e) => updateField(i, "name", e.target.value)}
                                        placeholder="Enter officer’s full name"
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    />
                                </div>

                                {/* Rank, License, Training Info */}
                                <div className="grid sm:grid-cols-2 gap-4 mt-3">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500">
                                            Rank
                                        </label>
                                        <input
                                            type="text"
                                            value={o.rank || ""}
                                            onChange={(e) =>
                                                updateField(i, "rank", e.target.value.toUpperCase())
                                            }
                                            placeholder="e.g. SO, SSO, CSO"
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-500">
                                            License Number
                                        </label>
                                        <input
                                            type="text"
                                            value={o.licenseNumber || ""}
                                            onChange={(e) =>
                                                updateField(i, "licenseNumber", e.target.value)
                                            }
                                            placeholder="Enter license number"
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-500">
                                            License Expiry
                                        </label>
                                        <input
                                            type="date"
                                            value={o.licenseExpiry || ""}
                                            onChange={(e) =>
                                                updateField(i, "licenseExpiry", e.target.value)
                                            }
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-500">
                                            Trained
                                        </label>
                                        <select
                                            value={o.trained ? "yes" : "no"}
                                            onChange={(e) =>
                                                updateField(i, "trained", e.target.value === "yes")
                                            }
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Notifications */}
                                <div className="mt-4">
                                    <label className="text-xs font-semibold text-slate-500">
                                        Notifications
                                    </label>
                                    <select
                                        value={o.notifications ?? 0}
                                        onChange={(e) =>
                                            updateField(i, "notifications", Number(e.target.value))
                                        }
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    >
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                    </select>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-5 justify-end">
                                    <button
                                        onClick={() => handleReject(i)}
                                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleValidate(i)}
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white px-5 py-2 rounded-full text-sm font-semibold shadow"
                                    >
                                        Validate
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
