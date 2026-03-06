"use client";

import { Bell, Search, User } from "lucide-react";
import LanguageToggle from "../shared/language-toggle";
import ThemeToggle from "../shared/theme-toggle";

export default function Navbar({ userName = "Resident" }) {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-8 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center space-x-4 flex-1">
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search complaints..."
                        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <LanguageToggle />

                <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors">
                    <Bell className="h-6 w-6" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F97316] ring-2 ring-white"></span>
                </button>

                <div className="flex items-center space-x-3 border-l pl-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500">Resident</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white shadow-inner">
                        <User className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </header>
    );
}
