"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { getSession } from "next-auth/react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LanguageToggle from "@/components/shared/language-toggle";

export default function LoginPage() {
    const t = useTranslations('auth');
    const commonT = useTranslations('common');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setLoading(false);
            } else {
                // Fetch session to check role
                const session = await getSession();
                const role = (session?.user as any)?.role;

                if (role === 'ADMIN') {
                    router.push("/admin/dashboard");
                } else if (role === 'AGENT') {
                    router.push("/agent/dashboard");
                } else {
                    router.push("/dashboard");
                }
            }
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sidebar-bg to-primary p-4 relative">
            <div className="absolute top-6 right-6">
                <LanguageToggle />
            </div>

            <div className="w-full max-w-md space-y-8 rounded-card bg-white p-8 shadow-card relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-light rounded-full opacity-50" />
                
                <div className="text-center relative">
                    <div className="inline-flex p-3 rounded-2xl bg-primary-light text-primary mb-4">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-text-primary">
                        NivaasDesk
                    </h2>
                    <p className="mt-2 text-sm text-text-muted">
                        {t('login_tagline')}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-button bg-danger/10 p-3 text-center text-sm text-danger animate-shake">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">{t('password')}</Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs font-semibold text-primary hover:underline"
                                >
                                    {t('forgot_password')}
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            t('sign_in_button')
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm text-text-muted mt-6">
                    {t('register_link').split('?')[0]}?{" "}
                    <Link
                        href="/auth/register"
                        className="font-bold text-primary hover:underline"
                    >
                        {t('register_link').split('?')[1] || "Register"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
