"use client";

import { useState } from "react";
import {
    Wrench,
    Sparkles,
    Utensils,
    ShieldCheck,
    Wifi,
    Volume2,
    FileStack,
    Settings,
    Upload,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
    { id: "MAINTENANCE", name: "Maintenance", icon: Wrench },
    { id: "CLEANLINESS", name: "Cleanliness", icon: Sparkles },
    { id: "FOOD", name: "Food & Mess", icon: Utensils },
    { id: "SECURITY", name: "Security", icon: ShieldCheck },
    { id: "WIFI_INTERNET", name: "WiFi & Internet", icon: Wifi },
    { id: "NOISE_DISTURBANCE", name: "Noise", icon: Volume2 },
    { id: "ADMINISTRATION", name: "Admin", icon: FileStack },
    { id: "OTHER", name: "Other", icon: Settings },
];

export default function ComplaintForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        priority: "MEDIUM",
        location: "", // Will allow editing or pre-fill
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [complaintId, setComplaintId] = useState("");
    const [error, setError] = useState("");

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/complaints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Submission failed");
            }

            setComplaintId(data.id);
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#1E3A5F] mb-2">Complaint Submitted!</h2>
                <p className="text-gray-600 mb-8">Your complaint ID is #{complaintId}. You can track its status in &apos;My Complaints&apos;.</p>
                <button
                    onClick={() => window.location.href = "/dashboard/complaints"}
                    className="bg-[#1E3A5F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#162C48] transition-all"
                >
                    Track Complaint
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-12 px-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center">
                        <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2",
                            step >= i ? "bg-[#1E3A5F] text-white border-[#1E3A5F]" : "bg-white text-gray-400 border-gray-200"
                        )}>
                            {i}
                        </div>
                        {i < 4 && (
                            <div className={cn(
                                "h-0.5 w-12 sm:w-24 mx-2",
                                step > i ? "bg-[#1E3A5F]" : "bg-gray-200"
                             )}></div>
                        )}
                    </div>
                ))}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                {step === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-[#1E3A5F] mb-1">Select Category</h2>
                            <p className="text-gray-500">What type of issue are you facing?</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, category: cat.id });
                                        nextStep();
                                    }}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:border-[#F97316] group",
                                        formData.category === cat.id ? "border-[#F97316] bg-orange-50" : "border-gray-100 bg-gray-50"
                                    )}
                                >
                                    <cat.icon className={cn(
                                        "h-8 w-8 mb-2 transition-colors",
                                        formData.category === cat.id ? "text-[#F97316]" : "text-gray-400 group-hover:text-[#F97316]"
                                    )} />
                                    <span className="text-xs font-semibold uppercase tracking-wider">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-[#1E3A5F] mb-1">Complaint Details</h2>
                            <p className="text-gray-500">Provide more information about the problem.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Title</label>
                                <input
                                    required
                                    placeholder="e.g., Broken ceiling fan"
                                    className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tell us more about the issue..."
                                    className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location (Room/Block)</label>
                                    <input
                                        placeholder="e.g., Block A, Room 204"
                                        required
                                        className="w-full rounded-xl border border-gray-200 p-3"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between pt-4 text-right">
                            <button type="button" onClick={prevStep} className="flex items-center text-gray-500 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg">
                                <ChevronLeft className="h-4 w-4 mr-2" /> Back
                            </button>
                            <button type="button" onClick={nextStep} className="flex items-center bg-[#1E3A5F] text-white font-medium px-8 py-2 rounded-lg hover:bg-[#162C48] transition-all">
                                Next <ChevronRight className="h-4 w-4 ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 text-right">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-[#1E3A5F] mb-1">Attachments</h2>
                            <p className="text-gray-500 text-right">Upload photos of the issue (Max 3 files).</p>
                        </div>
                        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-[#F97316]/50 transition-colors bg-gray-50/50">
                            <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-sm text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
                            <p className="text-xs text-gray-400">Supports JPG, PNG, WebP up to 5MB</p>
                            <input type="file" className="hidden" multiple />
                        </div>
                        <div className="flex justify-between pt-4">
                            <button type="button" onClick={prevStep} className="flex items-center text-gray-500 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg">
                                <ChevronLeft className="h-4 w-4 mr-2" /> Back
                            </button>
                            <button type="button" onClick={nextStep} className="flex items-center bg-[#1E3A5F] text-white font-medium px-8 py-2 rounded-lg hover:bg-[#162C48] transition-all">
                                Review <ChevronRight className="h-4 w-4 ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 text-right">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-[#1E3A5F] mb-1">Review & Submit</h2>
                            <p className="text-gray-500 text-right">Please confirm all details before submitting.</p>
                        </div>
                        <div className="space-y-6 bg-gray-50 p-6 rounded-2xl">
                            <div className="flex justify-between items-start">
                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#F97316] mb-1">Category</p>
                                    <p className="text-sm font-medium">{categories.find(c => c.id === formData.category)?.name}</p>
                                </div>
                                <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-blue-600 hover:underline px-2">Edit</button>
                            </div>
                            <div className="flex justify-between items-start border-t border-gray-200 pt-4 text-right">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#F97316] mb-1">Problem</p>
                                    <p className="text-sm font-bold text-gray-900">{formData.title}</p>
                                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{formData.description}</p>
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="text-xs font-bold text-blue-600 hover:underline px-2">Edit</button>
                            </div>
                            <div className="flex justify-between items-start border-t border-gray-200 pt-4 text-right">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#F97316] mb-1">Details</p>
                                    <div className="flex space-x-4">
                                        <p className="text-sm"><span className="text-gray-500">Priority:</span> {formData.priority}</p>
                                        <p className="text-sm border-r pr-4"><span className="text-gray-500">Location:</span> {formData.location}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="text-xs font-bold text-blue-600 hover:underline px-2">Edit</button>
                            </div>
                        </div>
                        <div className="flex justify-between pt-4">
                            <button type="button" onClick={prevStep} className="flex items-center text-gray-500 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg">
                                <ChevronLeft className="h-4 w-4 mr-2" /> Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center bg-[#F97316] text-white font-bold px-12 py-3 rounded-xl hover:bg-[#EA580C] shadow-lg shadow-orange-200 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                                Submit Complaint
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
