import { Link } from "@/i18n/routing";
import { ArrowRight, Shield, Clock, Zap, MessageSquare } from "lucide-react";

import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations('landing');
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0F1923] text-gray-900 dark:text-gray-100 transition-colors">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 bg-[#1E3A5F] rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">N</div>
                    <span className="text-2xl font-serif font-bold tracking-tight text-[#1E3A5F] dark:text-white">NivaasDesk</span>
                </div>
                <div className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <Link href="#features" className="hover:text-[#F97316] transition-colors">Features</Link>
                    <Link href="#solutions" className="hover:text-[#F97316] transition-colors">Solutions</Link>
                    <Link href="/login" className="bg-[#1E3A5F] text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-200 hover:scale-105 transition-all">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-5xl mx-auto">
                <div className="inline-flex items-center space-x-2 bg-orange-50 dark:bg-orange-950/30 text-[#F97316] px-4 py-2 rounded-full text-xs font-bold mb-8 border border-orange-100 dark:border-orange-900/50">
                    <Zap className="h-4 w-4" />
                    <span>{t('new_support')}</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-serif font-bold text-[#1E3A5F] dark:text-white leading-tight mb-8">
                    {t('hero_title_1')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#F59E0B]">{t('hero_title_2')}</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mb-12 leading-relaxed">
                    {t('tagline')}
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <Link href="/login" className="flex items-center space-x-2 bg-[#1E3A5F] text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-900/20 hover:bg-[#162C48] transition-all group">
                        <span>Log In to Dashboard</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/register" className="flex items-center space-x-2 border-2 border-gray-100 dark:border-gray-800 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all opacity-80">
                        <span>Register Now</span>
                    </Link>
                </div>

                {/* Simple Social Proof */}
                <div className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-800 w-full">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 text-center">Trusted by premier educational institutions</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale filter">
                        <div className="font-serif font-bold text-2xl">IIT DELHI</div>
                        <div className="font-serif font-bold text-2xl">BITS PILANI</div>
                        <div className="font-serif font-bold text-2xl">VIT UNIVERSITY</div>
                        <div className="font-serif font-bold text-2xl">NIT TRICHY</div>
                    </div>
                </div>
            </header>

            {/* Feature Section */}
            <section id="features" className="py-24 bg-[#F8F7F4] dark:bg-[#0A121A]">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold text-[#1E3A5F] dark:text-white mb-4">Everything You Need.</h2>
                        <p className="text-gray-500 dark:text-gray-400">Designed for modern hostel living.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Real-time Tracking", desc: "Track your complaint from submission to resolution with live status updates.", icon: Clock },
                            { title: "Bilingual UI", desc: "Switch seamlessly between English and Hindi for maximum accessibility.", icon: MessageSquare },
                            { title: "Secure & Fast", desc: "Enterprise-grade security ensuring student data privacy and 24/7 uptime.", icon: Shield },
                        ].map((feature, i) => (
                            <div key={i} className="bg-white dark:bg-[#0F1923] p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all">
                                <div className="h-14 w-14 bg-orange-50 dark:bg-orange-950/20 rounded-2xl flex items-center justify-center mb-8 text-[#F97316]">
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 dark:text-white">{feature.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0F1923] text-center">
                <p className="text-sm text-gray-400">© 2026 NivaasDesk. Empowering Student Living Experience.</p>
            </footer>
        </div>
    );
}
