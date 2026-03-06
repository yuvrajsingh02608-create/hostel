"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Building2, Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LanguageToggle from "@/components/shared/language-toggle";

export default function RegisterPage() {
    const t = useTranslations('auth');
    const commonT = useTranslations('common');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        roomNumber: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/auth/login?registered=true");
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface p-4 relative">
             <div className="absolute top-6 left-6">
                <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        {commonT('cancel')}
                    </Button>
                </Link>
            </div>
            <div className="absolute top-6 right-6">
                <LanguageToggle />
            </div>

            <div className="w-full max-w-lg space-y-8 rounded-card bg-white p-8 shadow-card border border-border">
                <div className="text-center">
                    <div className="inline-flex p-3 rounded-2xl bg-primary-light text-primary mb-4">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-text-primary">
                        {t('register_title')}
                    </h2>
                    <p className="mt-2 text-sm text-text-muted">
                        Join NivaasDesk and manage your hostel life efficiently.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-button bg-danger/10 p-3 text-center text-sm text-danger">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('full_name')}</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t('password')}</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{t('confirm_password')}</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="roomNumber">{t('room_number')}</Label>
                            <Input
                                id="roomNumber"
                                name="roomNumber"
                                required
                                placeholder="E.g. 204"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t('phone')}</Label>
                            <Input
                                id="phone"
                                name="phone"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {commonT('loading')}
                            </>
                        ) : (
                            t('register_button')
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm text-text-muted">
                    <span>Already have an account? </span>
                    <Link
                        href="/auth/login"
                        className="font-bold text-primary hover:underline"
                    >
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}
