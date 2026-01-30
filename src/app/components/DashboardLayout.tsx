import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  Scroll,
  Pencil,
  HardHat,
  Shield,
  Leaf,
  Zap,
  Package,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { BackToDashboardButton } from "./BackToDashboardButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { title: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
      { title: "Analytics", path: "/executive-analytics", icon: <Activity className="w-5 h-5" /> },
    ],
  },
  {
    group: "Station Essentials",
    items: [
      { title: "Station Information", path: "/station-information", icon: <Building2 className="w-5 h-5" /> },
      { title: "Station Type", path: "/station-type", icon: <FileText className="w-5 h-5" /> },
      { title: "Station Status", path: "/station-status", icon: <FileText className="w-5 h-5" /> },
    ],
  },
  {
    group: "Ownership & Legal",
    items: [
      { title: "Owner Information", path: "/owner-information", icon: <Users className="w-5 h-5" /> },
      { title: "Deed Information", path: "/deed-information", icon: <Scroll className="w-5 h-5" /> },
      { title: "Contract", path: "/contract", icon: <FileText className="w-5 h-5" /> },
    ],
  },
  {
    group: "Engineering & Design",
    items: [
      { title: "Consultation Office", path: "/consultation-office", icon: <Pencil className="w-5 h-5" /> },
      { title: "Architectural Design", path: "/architectural-design", icon: <Pencil className="w-5 h-5" /> },
      { title: "Building Permit", path: "/building-permit", icon: <HardHat className="w-5 h-5" /> },
    ],
  },
  {
    group: "Government Licenses",
    items: [
      { title: "Commercial License", path: "/commercial-license", icon: <FileText className="w-5 h-5" /> },
      { title: "Salamah License", path: "/salamah-license", icon: <Shield className="w-5 h-5" /> },
      { title: "Taqyees License", path: "/taqyees-license", icon: <FileText className="w-5 h-5" /> },
      { title: "Environmental License", path: "/environmental-license", icon: <Leaf className="w-5 h-5" /> },
      { title: "Energy License", path: "/energy-license", icon: <Zap className="w-5 h-5" /> },
    ],
  },
  {
    group: "Assets",
    items: [
      { title: "Fixed Assets", path: "/fixed-assets", icon: <Package className="w-5 h-5" /> },
    ],
  },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    navigation.map((g) => g.group)
  );
  const location = useLocation();

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
  };

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
                  <p className="text-xs text-white/80">Project Management</p>
                </div>
              </div>
            ) : (
              <Building2 className="w-8 h-8 text-white drop-shadow-lg" />
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}>
            {navigation.map((group) => (
              <div key={group.group} className="mb-2">
                {sidebarOpen && (
                  <button
                    onClick={() => toggleGroup(group.group)}
                    className="w-full px-4 py-2 flex items-center justify-between text-sm font-semibold text-white/70 hover:text-white transition-colors"
                  >
                    <span>{group.group}</span>
                    {expandedGroups.includes(group.group) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
                {(expandedGroups.includes(group.group) || !sidebarOpen) && (
                  <div className="mt-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${location.pathname === item.path
                          ? "bg-white/25 text-white shadow-lg backdrop-blur-sm"
                          : "text-white/80 hover:bg-white/15 hover:text-white"
                          }`}
                      >
                        {item.icon}
                        {sidebarOpen && <span className="text-sm">{item.title}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 ${sidebarOpen
            ? "ltr:ml-72 rtl:mr-72"
            : "ltr:ml-20 rtl:mr-20"
            } transition-all duration-300`}
        >
          {/* Header with Back to Dashboard Button */}
          <div className="bg-white/80 backdrop-blur-xl border-b border-violet-100 px-8 py-4 sticky top-0 z-10 shadow-lg shadow-violet-100/50 flex items-center justify-between">
            <BackToDashboardButton />
            <LanguageSwitcher />
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}





