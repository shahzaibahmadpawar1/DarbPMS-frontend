import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FileText,
  Menu,
  X,
  Activity,
  LogOut,
  MessageCircle,
  PlusCircle,
  ClipboardList,
} from "lucide-react";
import { BackToDashboardButton } from "./BackToDashboardButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BrandName } from "./BrandName";
import { ChatWidget } from "./ChatWidget";
import { useStation } from "../context/StationContext";
import { useTranslation } from "../../utils/translations";
import logo from "../../assets/logo.png";

interface NavItem {
  title: string;
  titleKey?: "analytics" | "tasks" | "reports" | "contactCEO";
  path: string;
  icon: React.ReactNode;
}

export function DashboardLayout() {
  // Start open on desktop (>= 1024px), closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const { t, lang } = useTranslation();
  const isRTL = lang === 'ar';

  const { selectedStation } = useStation();
  const stationName = selectedStation?.name || "Location N101";

  // Update sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation: NavItem[] = [
    { title: stationName, path: "/dashboard", icon: <img src={logo} alt="" className="w-5 h-5 object-contain brightness-0 invert" /> },
    { title: "", titleKey: "analytics", path: "/dashboard/executive-analytics", icon: <Activity className="w-5 h-5" /> },
    { title: "", titleKey: "tasks", path: "/dashboard/tasks", icon: <ClipboardList className="w-5 h-5" /> },
    { title: "", titleKey: "reports", path: "/dashboard/reports", icon: <FileText className="w-5 h-5" /> },
    { title: "", titleKey: "contactCEO", path: "/dashboard/contact-ceo", icon: <MessageCircle className="w-5 h-5" /> },
  ];

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
          className={`
            ${sidebarOpen ? "w-72 lg:w-72" : "w-72 lg:w-16"}
            ${sidebarOpen ? "translate-x-0" : `${isRTL ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0`}
            transition-all duration-300 sidebar-gradient text-white flex flex-col 
            fixed inset-y-0
            ${isRTL ? 'right-0' : 'left-0'}
            z-50 lg:z-10 shadow-2xl backdrop-blur-xl ${isRTL ? 'lg:rounded-l-[2.5rem]' : 'lg:rounded-r-[2.5rem]'} overflow-hidden hover:shadow-[0_0_80px_hsl(var(--primary)/0.3)]
          `}
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
                  <h1 className="font-bold text-base lg:text-lg text-white drop-shadow-lg"><BrandName /></h1>
                  <p className="text-xs text-white/80 truncate max-w-[150px]">{stationName}</p>
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
          <nav className={`flex-1 overflow-y-auto ${sidebarOpen ? 'p-4' : 'p-2'} space-y-2`}>
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={`flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-white/80 hover:bg-white/15 hover:text-white"
                  }`}
                title={!sidebarOpen ? (item.titleKey ? t(item.titleKey) : item.title) : undefined}
              >
                {item.icon}
                {sidebarOpen && <span className="text-sm font-medium">{item.titleKey ? t(item.titleKey) : item.title}</span>}
              </Link>
            ))}
            <button
              onClick={handleChatClick}
              className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg transition-all duration-200 text-white/80 hover:bg-white/15 hover:text-white relative`}
              title={!sidebarOpen ? t("chat") : undefined}
            >
              <MessageCircle className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm font-medium">{t("chat")}</span>}
              {sidebarOpen && (
                <span className="absolute top-2 left-8 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                  3
                </span>
              )}
            </button>
          </nav>

          {/* Logout Section */}
          <div className={`${sidebarOpen ? 'p-4' : 'p-2'} border-t border-white/20`}>
            <Link
              to="/login"
              className={`flex items-center ${sidebarOpen ? 'gap-3 px-4 mx-2' : 'justify-center px-2'} py-3 rounded-lg text-white/80 hover:bg-white/15 hover:text-white transition-all duration-200`}
              title={!sidebarOpen ? t("logout") : undefined}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm font-medium">{t("logout")}</span>}
            </Link>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className={`fixed inset-y-0 ${isRTL ? 'right-72 left-0' : 'left-72 right-0'} bg-black/50 z-40 lg:hidden`}
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 ${isRTL
            ? (sidebarOpen ? "lg:mr-72" : "lg:mr-16")
            : (sidebarOpen ? "lg:ml-72" : "lg:ml-16")
            } transition-all duration-300`}
        >
          {/* Mobile Header with Hamburger */}
          <div className="lg:hidden bg-card/80 backdrop-blur-xl mx-2 my-2 rounded-lg border border-border px-2 sm:px-4 py-2 sm:py-3 sticky top-2 z-10 shadow-lg flex items-center justify-between gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xs sm:text-sm font-bold truncate flex-1 min-w-0">{stationName}</h2>
            <LanguageSwitcher />
          </div>

          {/* Desktop Header */}
          <header className="hidden lg:flex bg-card/80 backdrop-blur-xl m-4 rounded-2xl border border-border px-4 md:px-6 lg:px-8 py-4 sticky top-4 z-10 shadow-lg shadow-primary/10 items-center justify-between flex-wrap gap-4">
            <BackToDashboardButton />
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                to="/dashboard/station-information"
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-xs md:text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Add New Project</span>
                <span className="sm:hidden">Add</span>
              </Link>
              <LanguageSwitcher />
            </div>
          </header>

          {/* Page Content */}
          <div className="p-2 sm:p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}





