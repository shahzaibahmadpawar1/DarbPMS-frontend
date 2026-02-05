import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Activity,
    Menu,
    X,
    LogOut,
    MessageCircle,
    FileText,
    PlusCircle,
    ClipboardList,
} from "lucide-react";
import { BackToDashboardButton } from "./BackToDashboardButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BrandName } from "./BrandName";
import { ChatWidget } from "./ChatWidget";
import logo from "../../assets/logo.png";

interface NavItem {
    title: string;
    path: string;
    icon: React.ReactNode;
}

const navigation: NavItem[] = [
    { title: "Dashboard", path: "/all-stations-dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: "Analytics", path: "/all-stations-analytics", icon: <Activity className="w-5 h-5" /> },
    { title: "Stations", path: "/all-stations-list", icon: <img src={logo} alt="" className="w-5 h-5 object-contain brightness-0 invert" /> },
    { title: "Tasks", path: "/all-stations-tasks", icon: <ClipboardList className="w-5 h-5" /> },
    { title: "Reports", path: "/all-stations-reports", icon: <FileText className="w-5 h-5" /> },
    { title: "Contact CEO Office", path: "/all-stations-contact-ceo", icon: <MessageCircle className="w-5 h-5" /> },
];

export function AllStationsDashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const location = useLocation();

    const handleChatClick = () => {
        setChatOpen(!chatOpen);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex relative overflow-hidden">
            {/* Animated mesh gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.05),transparent_50%)] pointer-events-none"></div>

            {/* Content wrapper */}
            <div className="relative z-0 flex w-full">
                {/* Sidebar */}
                <aside
                    className={`${sidebarOpen ? "w-72" : "w-20"
                        } transition-all duration-300 bg-gradient-to-br from-primary-600 via-primary to-secondary-600 text-white flex flex-col fixed inset-y-4 ltr:left-4 rtl:right-4 z-10 shadow-2xl backdrop-blur-xl rounded-[2.5rem] overflow-hidden`}
                    style={{
                        boxShadow: '0 0 60px hsl(var(--primary) / 0.2), 0 0 120px hsl(var(--secondary) / 0.1)'
                    }}
                >
                    {/* Logo & Toggle */}
                    <div className="p-4 flex items-center justify-between border-b border-white/20 backdrop-blur-sm">
                        {sidebarOpen ? (
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
                                    <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-lg text-white drop-shadow-lg"><BrandName /></h1>
                                    <p className="text-xs text-white/80">All Stations</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
                                <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                            </div>
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
                        <button
                            onClick={handleChatClick}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/80 hover:bg-white/15 hover:text-white relative"
                        >
                            <MessageCircle className="w-5 h-5" />
                            {sidebarOpen && <span className="text-sm font-medium">Chat</span>}
                            <span className="absolute top-2 left-8 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                                3
                            </span>
                        </button>
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
                        ? "ltr:ml-80 rtl:mr-80"
                        : "ltr:ml-28 rtl:mr-28"
                        } transition-all duration-300 relative z-0`}
                >
                    {/* Header */}
                    <header className="bg-card/80 backdrop-blur-xl m-4 rounded-2xl border border-border px-8 py-4 sticky top-4 z-10 shadow-lg shadow-primary/10 flex items-center justify-between">
                        <BackToDashboardButton />
                        <div className="flex items-center gap-4">
                            <Link
                                to="/add-new-project"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Add New Project</span>
                            </Link>
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
