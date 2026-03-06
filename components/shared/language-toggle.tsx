"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export default function LanguageToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLang = () => {
        const newLocale = locale === "en" ? "hi" : "en";
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <button
            onClick={toggleLang}
            className="flex items-center space-x-2 rounded-full border border-border bg-card dark:bg-slate-800 px-3 py-1.5 text-sm font-bold text-text-muted shadow-sm transition-all hover:bg-surface hover:border-primary/30 focus:outline-none"
        >
            <span className={cn(locale === "en" ? "text-primary" : "text-text-muted/60")}>EN</span>
            <span className="text-text-muted/40">|</span>
            <span className={cn(locale === "hi" ? "text-primary" : "text-text-muted/60")}>हिंदी</span>
        </button>
    );
}
