import { useState, useEffect } from "react";
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
    Upload,
} from "lucide-react";
import { BackToDashboardButton } from "./BackToDashboardButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BrandName } from "./BrandName";
import { ChatWidget } from "./ChatWidget";
import { useTranslation } from "../../utils/translations";
import logo from "../../assets/logo.png";
import * as XLSX from 'xlsx';
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface NavItem {
    titleKey: "dashboard" | "analytics" | "stations" | "tasks" | "reports" | "contactCEO";
    path: string;
    icon: React.ReactNode;
}

export function AllStationsDashboardLayout() {
    // Start open on desktop (>= 1024px), closed on mobile
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return false;
    });
    const [chatOpen, setChatOpen] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const location = useLocation();
    const { t, lang } = useTranslation();
    const isRTL = lang === 'ar';


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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImportLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    alert("The file seems to be empty or has no data rows.");
                    return;
                }

                // Helper to find value by case-insensitive name
                const getValue = (row: any, ...keys: string[]) => {
                    const rowKeys = Object.keys(row);
                    for (const key of keys) {
                        const targetKey = rowKeys.find(rk =>
                            rk.toLowerCase().replace(/[^a-z0-9]/g, '') ===
                            key.toLowerCase().replace(/[^a-z0-9]/g, '')
                        );
                        if (targetKey !== undefined) return row[targetKey];
                    }
                    return undefined;
                };

                // Map Excel columns to backend fields
                const mappedData = jsonData.map((row: any) => ({
                    stationCode: getValue(row, 'stationCode', 'station_code', 'Station Code', 'Code'),
                    stationName: getValue(row, 'stationName', 'station_name', 'Station Name', 'Name'),
                    areaRegion: getValue(row, 'areaRegion', 'area_region', 'Area/Region', 'Region'),
                    city: getValue(row, 'city', 'City'),
                    district: getValue(row, 'district', 'District'),
                    street: getValue(row, 'street', 'Street'),
                    geographicLocation: getValue(row, 'geographicLocation', 'geographic_location', 'Geographic Location', 'Location'),
                    stationTypeCode: getValue(row, 'stationTypeCode', 'station_type_code', 'Station Type Code', 'Type'),
                    stationStatusCode: getValue(row, 'stationStatusCode', 'station_status_code', 'Station Status Code', 'Status')
                }));

                const token = localStorage.getItem('auth_token');
                const response = await axios.post(`${API_BASE_URL}/stations/bulk`, mappedData, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { successCount, errorCount, errors } = response.data;
                let message = `Import Processed ${jsonData.length} rows.\n\nSuccessfully Imported: ${successCount}\nErrors: ${errorCount}`;

                if (errorCount > 0) {
                    message += "\n\nError details (first 3):\n" +
                        errors.slice(0, 3).map((err: any) => `- ${err.stationCode}: ${err.error}`).join('\n');
                }

                alert(message);
                if (successCount > 0) window.location.reload();
            } catch (error: any) {
                console.error("Import failed:", error);
                alert(`Import Failed: ${error.response?.data?.error || error.message}`);
            } finally {
                setImportLoading(false);
                if (event.target) event.target.value = '';
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const navigation: NavItem[] = [
        { titleKey: "dashboard", path: "/all-stations-dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { titleKey: "analytics", path: "/all-stations-analytics", icon: <Activity className="w-5 h-5" /> },
        { titleKey: "stations", path: "/all-stations-list", icon: <img src={logo} alt="" className="w-5 h-5 object-contain brightness-0 invert" /> },
        { titleKey: "tasks", path: "/all-stations-tasks", icon: <ClipboardList className="w-5 h-5" /> },
        { titleKey: "reports", path: "/all-stations-reports", icon: <FileText className="w-5 h-5" /> },
        { titleKey: "contactCEO", path: "/all-stations-contact-ceo", icon: <MessageCircle className="w-5 h-5" /> },
    ];

    const handleChatClick = () => {
        setChatOpen(!chatOpen);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.05),transparent_50%)] pointer-events-none"></div>

            <div className="relative z-0 flex w-full">
                <aside
                    className={`
                        ${sidebarOpen ? "w-72 lg:w-72" : "w-72 lg:w-16"}
                        ${sidebarOpen ? "translate-x-0" : `${isRTL ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0`}
                        transition-all duration-300 sidebar-gradient text-sidebar-foreground flex flex-col 
                        fixed inset-y-0
                        ${isRTL ? 'right-0' : 'left-0'}
                        z-50 lg:z-10 shadow-2xl backdrop-blur-xl ${isRTL ? 'lg:rounded-l-[2.5rem]' : 'lg:rounded-r-[2.5rem]'} overflow-hidden hover:shadow-[0_0_80px_hsl(var(--primary)/0.3)]
                    `}
                    style={{
                        boxShadow: '0 0 60px hsl(var(--primary) / 0.2), 0 0 120px hsl(var(--secondary) / 0.1)'
                    }}
                >
                    <div className="p-4 flex items-center justify-between border-b border-white/20 backdrop-blur-sm">
                        {sidebarOpen ? (
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
                                    <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-base lg:text-lg text-white drop-shadow-lg"><BrandName /></h1>
                                    <p className="text-xs text-white/80">{t("allStations")}</p>
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
                                title={!sidebarOpen ? t(item.titleKey) : undefined}
                            >
                                {item.icon}
                                {sidebarOpen && <span className="text-sm font-medium">{t(item.titleKey)}</span>}
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

                {sidebarOpen && (
                    <div
                        className={`fixed inset-y-0 ${isRTL ? 'right-72 left-0' : 'left-72 right-0'} bg-black/50 z-40 lg:hidden`}
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                <main
                    className={`flex-1 ${isRTL
                        ? (sidebarOpen ? "lg:mr-72" : "lg:mr-16")
                        : (sidebarOpen ? "lg:ml-72" : "lg:ml-16")
                        } transition-all duration-300 relative z-0 overflow-auto`}
                >
                    {/* Mobile Header */}
                    <div className="lg:hidden bg-card/80 backdrop-blur-xl mx-2 my-2 rounded-lg border border-border px-2 sm:px-4 py-2 sm:py-3 sticky top-2 z-10 shadow-lg flex items-center justify-between gap-2">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-xs sm:text-sm font-bold truncate flex-1 min-w-0">{t("allStations")}</h2>
                        <LanguageSwitcher />
                    </div>

                    {/* Desktop Header */}
                    <header className="hidden lg:flex bg-card/80 backdrop-blur-xl m-4 rounded-2xl border border-border px-4 md:px-6 lg:px-8 py-4 sticky top-4 z-10 shadow-lg shadow-primary/10 items-center justify-between flex-wrap gap-4">
                        <BackToDashboardButton />
                        <div className="flex items-center gap-2 md:gap-4">
                            <label
                                className={`flex items-center gap-2 px-3 md:px-4 py-2 border-2 border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-all duration-200 font-semibold text-xs md:text-sm cursor-pointer ${importLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Upload className="w-4 h-4" />
                                <span className="hidden sm:inline">{importLoading ? 'Importing...' : t("importStations")}</span>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={importLoading}
                                />
                            </label>

                            <Link
                                to="/station/new-station/form/station-information"
                                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-xs md:text-sm"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">{t("addNewProject")}</span>
                                <span className="sm:hidden">{t("addNewProject").split(" ")[0]}</span>
                            </Link>
                            <LanguageSwitcher />
                        </div>
                    </header>

                    <div className="p-2 sm:p-4 md:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}
