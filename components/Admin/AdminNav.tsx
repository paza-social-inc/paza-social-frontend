"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Users,
  Briefcase,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  UserCircle,
} from "lucide-react";
import { useState } from "react";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/admin", key: "dashboard" },
    { name: "Creators", icon: Users, href: "/admin/creators", key: "creators" },
    { name: "Campaigns", icon: Briefcase, href: "/admin/campaigns", key: "campaigns" },
    { name: "Brands", icon: Users, href: "/admin/brands", key: "brands" },
    { name: "Financials", icon: CreditCard, href: "/admin/payments", key: "financials" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminId");
    router.push("/admin-login");
  };

  return (
    <nav className="bg-[#0F1115] border-b border-[#262B36] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition">
              <BarChart3 className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">
              Paza
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border ${
                    isActive
                      ? "bg-orange-500/10 text-orange-300 border-orange-500/20"
                      : "text-zinc-400 border-transparent hover:text-white hover:bg-[#1B2029] hover:border-[#2A3140]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* NOTIFICATIONS */}
            <button className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#1B2029] transition border border-transparent hover:border-[#2A3140]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            </button>

            {/* USER MENU */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-[#1B2029] hover:bg-[#242B36] border border-[#2A3140] rounded-xl transition"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <UserCircle className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-sm text-white hidden sm:inline font-medium">
                  Admin
                </span>
              </button>

              {/* DROPDOWN */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-[#181C23] border border-[#262B36] rounded-xl shadow-lg overflow-hidden">
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-[#242B36] transition border-b border-[#262B36]"
                  >
                    <Settings className="w-4 h-4 text-orange-400" />
                    Profile Settings Page
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-[#242B36] transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#1B2029] border border-transparent hover:border-[#2A3140] transition"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-[#262B36] py-3">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition ${
                      isActive
                        ? "bg-orange-500/10 text-orange-300"
                        : "text-zinc-400 hover:text-white hover:bg-[#1B2029]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}