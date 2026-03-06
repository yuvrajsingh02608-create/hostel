import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations('errors');
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface text-text-primary p-6 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold">{t('notFound_title')}</h2>
        <p className="text-text-muted max-w-md mx-auto">
          {t('notFound_description')}
        </p>
        <div className="pt-6">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            {t('back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
