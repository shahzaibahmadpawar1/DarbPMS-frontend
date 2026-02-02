import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Activity,
    ChevronRight,
    Menu,
    X,
    LogOut,
    MessageCircle,
} from "lucide-react";
import { BackToDashboardButton } from "./BackToDashboardButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ChatWidget } from "./ChatWidget";

interface NavItem {
    title: string;
    path: string;
    icon: React.ReactNode;
}

const navigation: NavItem[] = [
    { title: "Dashboard", path: "/all-stations-dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: "Analytics", path: "/all-stations-analytics", icon: <Activity className="w-5 h-5" /> },
    { title: "Stations", path: "/all-stations-list", icon: <Building2 className="w-5 h-5" /> },
];

export function AllStationsDashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-pink-50 flex relative overflow-hidden">
            {/* Animated mesh gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-100/30 via-transparent to-cyan-100/30 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.08),transparent_50%)] pointer-events-none"></div>

            {/* Content wrapper */}
            <div className="relative z-0 flex w-full">
                {/* Sidebar */}
                <aside
                    className={`${sidebarOpen ? "w-72" : "w-20"
                        } transition-all duration-300 bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 text-white flex flex-col fixed h-screen z-10 shadow-2xl backdrop-blur-xl`}
                    style={{
                        boxShadow: '0 0 60px rgba(139, 92, 246, 0.4), 0 0 120px rgba(6, 182, 212, 0.2)'
                    }}
                >
                    {/* Logo & Toggle */}
                    <div className="p-4 flex items-center justify-between border-b border-white/20 backdrop-blur-sm">
                        {sidebarOpen ? (
                            <div className="flex items-center gap-2">
                                <Building2 className="w-8 h-8 text-white drop-shadow-lg" />
                                <div>
                                    <h1 className="font-bold text-lg text-white drop-shadow-lg">DARB</h1>
                                    <p className="text-xs text-white/80">All Stations</p>
                                </div>
                            </div>
                        ) : (
                            <Building2 className="w-8 h-8 text-white drop-shadow-lg" />
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
                        >
                            {sidebarOpen ? (
                                <X className="w-5 h-5 text-white" />
                            ) : (
                                <Menu className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path
                                    ? "bg-white/25 text-white shadow-lg backdrop-blur-sm"
                                    : "text-white/80 hover:bg-white/15 hover:text-white"
                                    }`}
                            >
                                {item.icon}
                                {sidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
                            </Link>
                        ))}
                    </nav>

                    {/* Logout Section */}
                    <div className="p-4 border-t border-white/20">
                        <Link
                            to="/login"
                            className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-white/80 hover:bg-white/15 hover:text-white transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            {sidebarOpen && <span className="text-sm font-medium">Log out</span>}
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main
                    className={`flex-1 ${sidebarOpen
                        ? "ltr:ml-72 rtl:mr-72"
                        : "ltr:ml-20 rtl:mr-20"
                        } transition-all duration-300 relative z-0`}
                >
                    {/* Header */}
                    <header className="bg-white/80 backdrop-blur-xl border-b border-violet-100 px-8 py-4 sticky top-0 z-10 shadow-lg shadow-violet-100/50 flex items-center justify-between">
                        <BackToDashboardButton />
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setChatOpen(!chatOpen)}
                                className="relative p-2 hover:bg-violet-100 rounded-lg transition-colors"
                                aria-label="Open chat"
                            >
                                <MessageCircle className="w-5 h-5 text-violet-600" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                                    3
                                </span>
                            </button>
                            <LanguageSwitcher />
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Chat Widget */}
            <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}
