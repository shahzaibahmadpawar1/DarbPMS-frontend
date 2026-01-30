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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-72" : "w-20"
          } transition-all duration-300 bg-black text-white flex flex-col fixed h-screen z-10`}
      >
        {/* Logo & Toggle */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-[#ff6b35]" />
              <div>
                <h1 className="font-bold text-lg text-[#ff6b35]">DARB</h1>
                <p className="text-xs text-gray-400">Project Management</p>
              </div>
            </div>
          ) : (
            <Building2 className="w-8 h-8 text-[#ff6b35]" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-track-black scrollbar-thumb-gray-800 hover:scrollbar-thumb-gray-700" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1f1f1f black' }}>
          {navigation.map((group) => (
            <div key={group.group} className="mb-2">
              {sidebarOpen && (
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full px-4 py-2 flex items-center justify-between text-sm font-semibold text-gray-400 hover:text-white transition-colors"
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
                      className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${location.pathname === item.path
                        ? "bg-[#ff6b35] text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
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
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 shadow-sm flex items-center justify-between">
          <BackToDashboardButton />
          <LanguageSwitcher />
        </div>

        <Outlet />
      </main>
    </div>
  );
}
