"use client";

import { memo } from "react";
import Link from "next/link";

function Navbar() {
    const openSidebar = () => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new CustomEvent("sidebar-toggle"));
    };

    return (
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl text-slate-100 shadow-black/10 shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-fuchsia-500 text-base font-bold text-white shadow-lg shadow-slate-900/20">
                        E
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-base font-semibold text-white">Employee TMS</span>
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Premium Ops</span>
                    </div>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white">Home</Link>
                    <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white">Dashboard</Link>
                    <Link href="/login" className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Sign In</Link>
                </div>

                <div className="md:hidden">
                    <button
                        aria-label="Open sidebar"
                        onClick={openSidebar}
                        className="rounded-full border border-slate-800 bg-slate-900 p-2 text-white shadow-sm shadow-slate-950/30 hover:bg-slate-800"
                    >
                        ☰
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default memo(Navbar);
