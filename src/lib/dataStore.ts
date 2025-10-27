// src/lib/dataStore.ts

export interface Job {
    id: number;
    site: string;
    siteType: string;
    date: string;
    rank: string;
    startTime: string;
    endTime: string;
    urgency: string; // e.g. "Normal" | "Rush"
    suggestedPay: number;
    offerPay: number | string;
    status: "Open" | "Pending" | "Booked" | "Completed";
    committedBy?: string;
    commitTime?: number | null;

    // 🧩 Separate review objects
    agencyReview?: {
        rating?: number;
        traits?: string[];
        comments?: string;
        timestamp?: number;
    };

    officerReview?: {
        rating?: number;
        traits?: string[];
        comments?: string;
        timestamp?: number;
    };
}

// localStorage key
const STORAGE_KEY = "shield_jobs";

// === Core functions ===
export function getJobs(): Job[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function saveJobs(jobs: Job[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function addJob(site: string, date: string, newJob: Job) {
    const jobs = getJobs();
    jobs.push(newJob);
    saveJobs(jobs);
}

export function updateJob(id: number, updates: Partial<Job>) {
    const jobs = getJobs().map((job) =>
        job.id === id ? { ...job, ...updates } : job
    );
    saveJobs(jobs);
}
