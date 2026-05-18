import { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    BarChart2,
    Activity,
    Menu,
    X,
    LogOut,
    MessageCircle,
    FileText,
    PlusCircle,
    ClipboardList,
    Upload,
    Inbox,
    Clock,
    Users,
    Building2,
    Settings,
    History,
    BookOpen,
    User,
    CheckCircle,
    Bell,
    DatabaseBackup,
} from "lucide-react";
import { BackToDashboardButton } from "./BackToDashboardButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BrandName } from "./BrandName";
import { ChatWidget } from "./ChatWidget";
import { useTranslation } from "../../utils/translations";
import { useAuth } from "@/context/AuthContext";
import { getRoleLabel, appSettingsAPI } from "@/services/api";
import {
    getOrInitLastSeenAt,
    markLastSeenNow,
    TASKS_LAST_SEEN_SUFFIX,
    toTimestamp,
    UNDER_REVIEW_LAST_SEEN_SUFFIX,
} from "@/utils/sidebarBadgeStorage";
import { TaskPendingBadge } from "@/components/TaskPendingBadge";
import { usePendingTaskCount } from "@/hooks/usePendingTaskCount";
import { useStation } from "../context/StationContext";
import { resolveStationAccessMode } from "@/utils/stationFormPermissions";
import { useStationFormAutofill } from "../hooks/useStationFormAutofill";
import { isCommitteeOpinionOnlyWorkflowUser } from "@/utils/investmentPermissions";
import {
    resolveExecutiveSidebarSlotOrderFiltered,
    resolveDeptSidebarSlotOrder,
} from "@/utils/allStationsSidebarSlots";
import {
    buildSidebarVisibilityContext,
    filterNestedChildren,
    isTopLevelSlotVisible,
} from "@/utils/sidebarVisibility";
import { canAccessPath, getDefaultRedirectPath } from "@/utils/sidebarRouteAccess";
import type { SidebarNestedOrder } from "@/utils/sidebarNestedOrder";
import { DEFAULT_SIDEBAR_NESTED_ORDER, normalizeSidebarNestedOrder } from "@/utils/sidebarNestedOrder";
import {
    workflowDeptHref,
    workflowDeptChildIsActive,
    workflowDepartmentFromPath,
    type WorkflowDepartmentType,
} from "@/utils/investmentDepartmentNav";
import logo from "../../assets/logo.png";
import * as XLSX from 'xlsx';
import axios from "axios";
import {
    AllStationsSidebarSlot,
    type NavItem,
    type SidebarNavRenderContext,
} from "./AllStationsSidebarSlot";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function AllStationsDashboardLayout() {
    // Start open on desktop (>= 1024px), closed on mobile
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return false;
    });
    const [chatOpen, setChatOpen] = useState(false);
    const [underReviewCount, setUnderReviewCount] = useState(0);
    const [importLoading, setImportLoading] = useState(false);
    const [systemSettingsOpen, setSystemSettingsOpen] = useState(false);
    const systemSettingsWrapRef = useRef<HTMLDivElement>(null);
    const [systemSettingsFlyout, setSystemSettingsFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [investmentMenuOpen, setInvestmentMenuOpen] = useState(false);
    const investmentWrapRef = useRef<HTMLDivElement>(null);
    const [investmentFlyout, setInvestmentFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [franchiseMenuOpen, setFranchiseMenuOpen] = useState(false);
    const franchiseWrapRef = useRef<HTMLDivElement>(null);
    const [franchiseFlyout, setFranchiseFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [dashboardMenuOpen, setDashboardMenuOpen] = useState(false);
    const dashboardWrapRef = useRef<HTMLDivElement>(null);
    const [dashboardFlyout, setDashboardFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [legalMenuOpen, setLegalMenuOpen] = useState(false);
    const legalWrapRef = useRef<HTMLDivElement>(null);
    const [legalFlyout, setLegalFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [projectMenuOpen, setProjectMenuOpen] = useState(false);
    const projectWrapRef = useRef<HTMLDivElement>(null);
    const [projectFlyout, setProjectFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [feasibilityStudyMenuOpen, setFeasibilityStudyMenuOpen] = useState(false);
    const feasibilityStudyWrapRef = useRef<HTMLDivElement>(null);
    const [feasibilityStudyFlyout, setFeasibilityStudyFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [preOpeningMenuOpen, setPreOpeningMenuOpen] = useState(false);
    const preOpeningWrapRef = useRef<HTMLDivElement>(null);
    const [preOpeningFlyout, setPreOpeningFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [orderRequestMenuOpen, setOrderRequestMenuOpen] = useState(false);
    const orderRequestWrapRef = useRef<HTMLDivElement>(null);
    const [orderRequestFlyout, setOrderRequestFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [openingSoonMenuOpen, setOpeningSoonMenuOpen] = useState(false);
    const openingSoonWrapRef = useRef<HTMLDivElement>(null);
    const [openingSoonFlyout, setOpeningSoonFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [tasksMenuOpen, setTasksMenuOpen] = useState(false);
    const tasksMenuWrapRef = useRef<HTMLDivElement>(null);
    const [tasksMenuFlyout, setTasksMenuFlyout] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const [sidebarSlotOrder, setSidebarSlotOrder] = useState<string[] | null>(null);
    const [sidebarNestedOrder, setSidebarNestedOrder] = useState(() =>
        normalizeSidebarNestedOrder(DEFAULT_SIDEBAR_NESTED_ORDER),
    );
    const location = useLocation();
    const navigate = useNavigate();
    const { t, lang } = useTranslation();
    const { user, token } = useAuth();
    const { taskCount, refreshTaskCount } = usePendingTaskCount(token, user?.id);
    const { selectedStation, setAccessMode } = useStation();
    const isRTL = lang === 'ar';
    const isDepartmentScopedUser = !!user && user.role !== 'super_admin' && user.role !== 'ceo';
    const canCreateDepartmentProject = !!user && ['super_admin', 'department_manager', 'supervisor'].includes(user.role);
    const isFranchiseUser = isDepartmentScopedUser && canCreateDepartmentProject && user?.department === 'franchise';
    const isDeptUser = isDepartmentScopedUser;
    const sidebarVisibilityCtx = useMemo(() => buildSidebarVisibilityContext(user), [user]);
    const canShowDepartmentAddButton = !!user
        && ['department_manager', 'supervisor'].includes(user.role)
        && (user.department === 'investment' || user.department === 'franchise');
    const addProjectPath = user?.department === 'franchise'
        ? '/station/new-station/form/franchise-department'
        : '/station/new-station/form/investment-department?tab=new-project';

    useEffect(() => {
        const mode = resolveStationAccessMode(user, location.pathname);
        if (mode) {
            setAccessMode(mode);
        }
    }, [user, location.pathname, setAccessMode]);

    useEffect(() => {
        // Used by fullscreen modals to center within the remaining content area.
        // When the sidebar is open on desktop, the modal would appear visually shifted left behind the sidebar.
        const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
        const offset = (isDesktop && sidebarOpen) ? '18rem' : '0rem';
        document.documentElement.style.setProperty('--sidebar-offset', offset);
        return () => {
            document.documentElement.style.setProperty('--sidebar-offset', '0rem');
        };
    }, [sidebarOpen]);
    useStationFormAutofill({
        pathname: location.pathname,
        stationCode: selectedStation?.station_code,
    });

    const isSystemSettingsRoute =
        location.pathname === "/all-stations-users" ||
        location.pathname === "/all-stations-settings" ||
        location.pathname === "/all-stations-settings/preferences";

    useEffect(() => {
        if (isSystemSettingsRoute) {
            setSystemSettingsOpen(true);
        }
    }, [isSystemSettingsRoute]);

    const workflowRouteDept = workflowDepartmentFromPath(location.pathname);
    const isInvestmentDeptRoute = workflowRouteDept === "investment";
    const isFranchiseDeptRoute = workflowRouteDept === "franchise";
    const isLegalRoute = location.pathname === "/all-stations-legal";
    const isFeasibilityStudyRoute =
        (location.pathname === "/all-stations-project" &&
            location.search.includes("tab=feasibility")) ||
        (location.pathname.includes("/investment-department") &&
            location.search.includes("tab=opinions"));
    const isProjectRoute =
        location.pathname === "/all-stations-list" ||
        location.pathname === "/all-stations-reports" ||
        (location.pathname === "/all-stations-project" &&
            !location.search.includes("tab=feasibility"));
    const isPreOpeningRoute = location.pathname === "/all-stations-pre-opening";
    const isOrderRequestRoute = location.pathname === "/all-stations-requests" || location.pathname === "/all-stations-order-requests-submitted";
    const isOpeningSoonRoute = location.pathname === "/all-stations-opening-soon-projects";
    const isTasksMenuRoute = location.pathname === "/all-stations-tasks";
    const isDashboardGroupRoute =
        location.pathname === "/all-stations-dashboard" ||
        location.pathname === "/all-stations-analytics" ||
        location.pathname === "/all-stations-recent-activities" ||
        location.pathname === "/all-stations-under-review" ||
        isInvestmentDeptRoute ||
        isFranchiseDeptRoute;

    useEffect(() => {
        if (isInvestmentDeptRoute) {
            setInvestmentMenuOpen(true);
        }
    }, [isInvestmentDeptRoute]);

    useEffect(() => {
        if (isFranchiseDeptRoute) {
            setFranchiseMenuOpen(true);
        }
    }, [isFranchiseDeptRoute]);

    useEffect(() => {
        if (isDashboardGroupRoute) {
            setDashboardMenuOpen(true);
        }
    }, [isDashboardGroupRoute]);
    useEffect(() => {
        if (isLegalRoute) setLegalMenuOpen(true);
    }, [isLegalRoute]);
    useEffect(() => {
        if (isProjectRoute) setProjectMenuOpen(true);
    }, [isProjectRoute]);
    useEffect(() => {
        if (isFeasibilityStudyRoute) setFeasibilityStudyMenuOpen(true);
    }, [isFeasibilityStudyRoute]);
    useEffect(() => {
        if (isPreOpeningRoute) setPreOpeningMenuOpen(true);
    }, [isPreOpeningRoute]);
    useEffect(() => {
        if (isOrderRequestRoute) setOrderRequestMenuOpen(true);
    }, [isOrderRequestRoute]);
    useEffect(() => {
        if (isOpeningSoonRoute) setOpeningSoonMenuOpen(true);
    }, [isOpeningSoonRoute]);
    useEffect(() => {
        if (isTasksMenuRoute) setTasksMenuOpen(true);
    }, [isTasksMenuRoute]);

    useLayoutEffect(() => {
        if (!systemSettingsOpen || sidebarOpen) {
            setSystemSettingsFlyout(null);
            return;
        }
        const update = () => {
            const el = systemSettingsWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 176;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setSystemSettingsFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [systemSettingsOpen, sidebarOpen, isRTL]);

    useLayoutEffect(() => {
        if (!investmentMenuOpen || sidebarOpen) {
            setInvestmentFlyout(null);
            return;
        }
        const update = () => {
            const el = investmentWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 200;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setInvestmentFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [investmentMenuOpen, sidebarOpen, isRTL]);

    useLayoutEffect(() => {
        if (!franchiseMenuOpen || sidebarOpen) {
            setFranchiseFlyout(null);
            return;
        }
        const update = () => {
            const el = franchiseWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 200;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setFranchiseFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [franchiseMenuOpen, sidebarOpen, isRTL]);

    useLayoutEffect(() => {
        if (!dashboardMenuOpen || sidebarOpen) {
            setDashboardFlyout(null);
            return;
        }
        const update = () => {
            const el = dashboardWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 220;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setDashboardFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [dashboardMenuOpen, sidebarOpen, isRTL]);
    useLayoutEffect(() => {
        if (!legalMenuOpen || sidebarOpen) {
            setLegalFlyout(null);
            return;
        }
        const update = () => {
            const el = legalWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 220;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setLegalFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [legalMenuOpen, sidebarOpen, isRTL]);
    useLayoutEffect(() => {
        if (!projectMenuOpen || sidebarOpen) {
            setProjectFlyout(null);
            return;
        }
        const update = () => {
            const el = projectWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 220;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setProjectFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [projectMenuOpen, sidebarOpen, isRTL]);
    useLayoutEffect(() => {
        if (!feasibilityStudyMenuOpen || sidebarOpen) {
            setFeasibilityStudyFlyout(null);
            return;
        }
        const update = () => {
            const el = feasibilityStudyWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 220;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setFeasibilityStudyFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [feasibilityStudyMenuOpen, sidebarOpen, isRTL]);
    useLayoutEffect(() => {
        if (!preOpeningMenuOpen || sidebarOpen) {
            setPreOpeningFlyout(null);
            return;
        }
        const update = () => {
            const el = preOpeningWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 220;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setPreOpeningFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [preOpeningMenuOpen, sidebarOpen, isRTL]);
    useLayoutEffect(() => {
        if (!orderRequestMenuOpen || sidebarOpen) {
            setOrderRequestFlyout(null);
            return;
        }
        const update = () => {
            const el = orderRequestWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 240;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setOrderRequestFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [orderRequestMenuOpen, sidebarOpen, isRTL]);
    useLayoutEffect(() => {
        if (!openingSoonMenuOpen || sidebarOpen) {
            setOpeningSoonFlyout(null);
            return;
        }
        const update = () => {
            const el = openingSoonWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 240;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setOpeningSoonFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [openingSoonMenuOpen, sidebarOpen, isRTL]);
    useLayoutEffect(() => {
        if (!tasksMenuOpen || sidebarOpen) {
            setTasksMenuFlyout(null);
            return;
        }
        const update = () => {
            const el = tasksMenuWrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = 220;
            const gap = 8;
            const left = isRTL
                ? Math.max(gap, r.left - width - gap)
                : Math.min(r.right + gap, window.innerWidth - width - gap);
            setTasksMenuFlyout({ top: r.top, left, width });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [tasksMenuOpen, sidebarOpen, isRTL]);

    useEffect(() => {
        const flyoutOpen = (systemSettingsOpen || investmentMenuOpen || franchiseMenuOpen || dashboardMenuOpen || legalMenuOpen || projectMenuOpen || preOpeningMenuOpen || orderRequestMenuOpen || openingSoonMenuOpen || tasksMenuOpen) && !sidebarOpen;
        if (!flyoutOpen) return;
        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            const inSystem =
                systemSettingsWrapRef.current?.contains(target) ||
                (event.target as Element).closest?.("[data-system-settings-flyout]");
            const inInvest =
                investmentWrapRef.current?.contains(target) ||
                (event.target as Element).closest?.("[data-investment-flyout]");
            const inFranchise =
                franchiseWrapRef.current?.contains(target) ||
                (event.target as Element).closest?.("[data-franchise-flyout]");
            const inDashboard =
                dashboardWrapRef.current?.contains(target) ||
                (event.target as Element).closest?.("[data-dashboard-flyout]");
            const inLegal =
                legalWrapRef.current?.contains(target) ||
                (event.target as Element).closest?.("[data-legal-flyout]");
            const inProject =
                projectWrapRef.current?.contains(target) ||
                (event.target as Element).closest?.("[data-project-flyout]");
            const inPreOpening =
                preOpeningWrapRef.current?.contains(target) ||
                (event.target as Element).closest?.("[data-pre-opening-flyout]");
            const inOrderRequest =
                orderRequestWrapRef.current?.contains(target) ||
                (event.target as Element).closest?.("[data-order-request-flyout]");
            const inOpeningSoon =
                openingSoonWrapRef.current?.contains(target) ||
                (event.target as Element).closest?.("[data-opening-soon-flyout]");
            const inTasksMenu =
                tasksMenuWrapRef.current?.contains(target) ||
                (event.target as Element).closest?.("[data-tasks-menu-flyout]");
            if (!inSystem && !inInvest && !inFranchise && !inDashboard && !inLegal && !inProject && !inPreOpening && !inOrderRequest && !inOpeningSoon && !inTasksMenu) {
                setSystemSettingsOpen(false);
                setInvestmentMenuOpen(false);
                setFranchiseMenuOpen(false);
                setDashboardMenuOpen(false);
                setLegalMenuOpen(false);
                setProjectMenuOpen(false);
                setPreOpeningMenuOpen(false);
                setOrderRequestMenuOpen(false);
                setOpeningSoonMenuOpen(false);
                setTasksMenuOpen(false);
            }
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [systemSettingsOpen, investmentMenuOpen, franchiseMenuOpen, dashboardMenuOpen, legalMenuOpen, projectMenuOpen, preOpeningMenuOpen, orderRequestMenuOpen, openingSoonMenuOpen, tasksMenuOpen, sidebarOpen]);


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

    useEffect(() => {
        if (!token || !user?.id) {
            setUnderReviewCount(0);
            return;
        }

        let isMounted = true;

        const fetchUnderReviewCount = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/investment-projects`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) return;

                const result = await response.json();
                if (isMounted && Array.isArray(result?.data)) {
                    const lastSeenAt = getOrInitLastSeenAt(user.id, UNDER_REVIEW_LAST_SEEN_SUFFIX);
                    const newItemsCount = result.data.filter((project: any) => {
                        if (project?.review_status === 'Approved') {
                            return false;
                        }

                        const createdAt = toTimestamp(project?.created_at);
                        return createdAt !== null && createdAt > lastSeenAt;
                    }).length;

                    setUnderReviewCount(newItemsCount);
                }
            } catch {
                if (isMounted) setUnderReviewCount(0);
            }
        };

        fetchUnderReviewCount();

        const onFocus = () => {
            fetchUnderReviewCount();
        };
        window.addEventListener("focus", onFocus);

        return () => {
            isMounted = false;
            window.removeEventListener("focus", onFocus);
        };
    }, [token, user?.id]);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const markTasksSeen = location.pathname === '/all-stations-tasks';
        const markUnderReviewSeen = location.pathname === '/all-stations-under-review';

        if (markTasksSeen) {
            markLastSeenNow(user.id, TASKS_LAST_SEEN_SUFFIX);
            void refreshTaskCount();
        }

        if (markUnderReviewSeen) {
            markLastSeenNow(user.id, UNDER_REVIEW_LAST_SEEN_SUFFIX);
            setUnderReviewCount(0);
        }
    }, [location.pathname, user?.id, refreshTaskCount]);

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

    const {
        showSystemUsers,
        showCompanyInfo,
        showUserSettings,
        showInvestmentMenu,
        showFranchiseMenu,
        showLegalMenu,
        showProjectMenu,
        showPreOpeningMenu,
        showFeasibilityStudyMenu,
        showCommitteeOpinionsNav,
        showOrderRequestMenu,
        showOpeningSoonMenu,
        showTasksMenu,
        canCreateInvestmentNav,
    } = sidebarVisibilityCtx;
    const committeeOpinionOnlyWorkflow = isCommitteeOpinionOnlyWorkflowUser(user);

    const filteredSidebarNestedOrder = useMemo((): SidebarNestedOrder => {
        const keys = Object.keys(sidebarNestedOrder) as (keyof SidebarNestedOrder)[];
        const out = { ...sidebarNestedOrder };
        for (const key of keys) {
            out[key] = filterNestedChildren(key, sidebarNestedOrder[key], sidebarVisibilityCtx) as SidebarNestedOrder[typeof key];
        }
        return out;
    }, [sidebarNestedOrder, sidebarVisibilityCtx]);

    useEffect(() => {
        if (!user) return;
        if (canAccessPath(user, location.pathname, location.search)) return;
        navigate(getDefaultRedirectPath(user), { replace: true });
    }, [user, location.pathname, location.search, navigate]);

    const navigation: NavItem[] = isDeptUser
        ? [
            { titleKey: "dashboard", path: "/all-stations-dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
            { titleKey: "recentActivities", path: "/all-stations-recent-activities", icon: <History className="w-5 h-5" /> },
            { titleKey: "underReview", path: "/all-stations-under-review", icon: <Clock className="w-5 h-5" /> },
                     { titleKey: "stations", path: "/all-stations-list", icon: <img src={logo} alt="" className="w-5 h-5 object-contain brightness-0 invert" /> },
                     { titleKey: "requests", path: "/all-stations-requests", icon: <Inbox className="w-5 h-5" /> },
                     { titleKey: "tasks", path: "/all-stations-tasks", icon: <ClipboardList className="w-5 h-5" /> },
                     { titleKey: "contactCEO", path: "/all-stations-contact-ceo", icon: <MessageCircle className="w-5 h-5" /> },
          ]
        : [
            { titleKey: "dashboard", path: "/all-stations-dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
            { titleKey: "recentActivities", path: "/all-stations-recent-activities", icon: <History className="w-5 h-5" /> },
            { titleKey: "analytics", path: "/all-stations-analytics", icon: <Activity className="w-5 h-5" /> },
            { titleKey: "stations", path: "/all-stations-list", icon: <img src={logo} alt="" className="w-5 h-5 object-contain brightness-0 invert" /> },
            { titleKey: "departments", path: "/all-stations-departments", icon: <Building2 className="w-5 h-5" /> },
            { titleKey: "requests", path: "/all-stations-requests", icon: <Inbox className="w-5 h-5" /> },
            { titleKey: "underReview", path: "/all-stations-under-review", icon: <Clock className="w-5 h-5" /> },
            { titleKey: "tasks", path: "/all-stations-tasks", icon: <ClipboardList className="w-5 h-5" /> },
            { titleKey: "contactCEO", path: "/all-stations-contact-ceo", icon: <MessageCircle className="w-5 h-5" /> },
          ];

    const loadSidebarSlots = useCallback(async () => {
        if (!token) {
            setSidebarSlotOrder(null);
            setSidebarNestedOrder(normalizeSidebarNestedOrder(DEFAULT_SIDEBAR_NESTED_ORDER));
            return;
        }
        try {
            const { order, nestedOrder } = await appSettingsAPI.getMySidebarNavConfig();
            setSidebarSlotOrder(order);
            setSidebarNestedOrder(normalizeSidebarNestedOrder(nestedOrder));
        } catch {
            setSidebarSlotOrder(null);
            setSidebarNestedOrder(normalizeSidebarNestedOrder(DEFAULT_SIDEBAR_NESTED_ORDER));
        }
    }, [token]);

    useEffect(() => {
        void loadSidebarSlots();
    }, [loadSidebarSlots]);

    useEffect(() => {
        const onSaved = () => {
            void loadSidebarSlots();
        };
        window.addEventListener("darb-sidebar-slots-saved", onSaved);
        return () => window.removeEventListener("darb-sidebar-slots-saved", onSaved);
    }, [loadSidebarSlots]);

    const resolvedSidebarSlots = useMemo(() => {
        const isSlotVisible = (slotId: string) => isTopLevelSlotVisible(slotId, sidebarVisibilityCtx);
        if (isDeptUser) return resolveDeptSidebarSlotOrder(sidebarSlotOrder, isFranchiseUser, isSlotVisible);
        return resolveExecutiveSidebarSlotOrderFiltered(sidebarSlotOrder, isSlotVisible);
    }, [isDeptUser, isFranchiseUser, sidebarSlotOrder, sidebarVisibilityCtx]);

    const sidebarNavCtx: SidebarNavRenderContext = useMemo(
        () => ({
            navigation,
            sidebarOpen,
            setSidebarOpen,
            location,
            t,
            taskCount,
            underReviewCount,
            isDeptUser,
            showSystemUsers,
            showCompanyInfo,
            showUserSettings,
            sidebarNestedOrder: filteredSidebarNestedOrder,
            projectMenuOpen,
            setProjectMenuOpen,
            isProjectRoute,
            showProjectMenu,
            feasibilityStudyMenuOpen,
            setFeasibilityStudyMenuOpen,
            isFeasibilityStudyRoute,
            showFeasibilityStudyMenu,
            showCommitteeOpinionsNav,
            feasibilityStudyWrapRef,
            preOpeningMenuOpen,
            setPreOpeningMenuOpen,
            isPreOpeningRoute,
            showPreOpeningMenu,
            orderRequestMenuOpen,
            setOrderRequestMenuOpen,
            isOrderRequestRoute,
            showOrderRequestMenu,
            openingSoonMenuOpen,
            setOpeningSoonMenuOpen,
            isOpeningSoonRoute,
            showOpeningSoonMenu,
            tasksMenuOpen,
            setTasksMenuOpen,
            isTasksMenuRoute,
            showTasksMenu,
            dashboardMenuOpen,
            setDashboardMenuOpen,
            isDashboardGroupRoute,
            legalMenuOpen,
            setLegalMenuOpen,
            isLegalRoute,
            showLegalMenu,
            investmentMenuOpen,
            setInvestmentMenuOpen,
            franchiseMenuOpen,
            setFranchiseMenuOpen,
            isInvestmentDeptRoute,
            isFranchiseDeptRoute,
            canCreateInvestmentNav,
            showInvestmentMenu,
            showFranchiseMenu,
            committeeOpinionOnlyWorkflow,
            systemSettingsOpen,
            setSystemSettingsOpen,
            isSystemSettingsRoute,
            projectWrapRef,
            preOpeningWrapRef,
            orderRequestWrapRef,
            openingSoonWrapRef,
            tasksMenuWrapRef,
            dashboardWrapRef,
            legalWrapRef,
            investmentWrapRef,
            franchiseWrapRef,
            systemSettingsWrapRef,
        }),
        [
            navigation,
            sidebarOpen,
            location,
            t,
            taskCount,
            underReviewCount,
            isDeptUser,
            showSystemUsers,
            showCompanyInfo,
            showUserSettings,
            filteredSidebarNestedOrder,
            projectMenuOpen,
            feasibilityStudyMenuOpen,
            preOpeningMenuOpen,
            orderRequestMenuOpen,
            openingSoonMenuOpen,
            tasksMenuOpen,
            dashboardMenuOpen,
            legalMenuOpen,
            investmentMenuOpen,
            franchiseMenuOpen,
            isDashboardGroupRoute,
            isLegalRoute,
            isInvestmentDeptRoute,
            isFranchiseDeptRoute,
            canCreateInvestmentNav,
            showInvestmentMenu,
            showFranchiseMenu,
            committeeOpinionOnlyWorkflow,
            showLegalMenu,
            isProjectRoute,
            showProjectMenu,
            isFeasibilityStudyRoute,
            showFeasibilityStudyMenu,
            showCommitteeOpinionsNav,
            isPreOpeningRoute,
            showPreOpeningMenu,
            isOrderRequestRoute,
            showOrderRequestMenu,
            isOpeningSoonRoute,
            showOpeningSoonMenu,
            isTasksMenuRoute,
            showTasksMenu,
            systemSettingsOpen,
            isSystemSettingsRoute,
        ],
    );

    const handleChatClick = () => {
        setChatOpen(!chatOpen);
    };

    const renderWorkflowFlyout = (
        dept: WorkflowDepartmentType,
        flyout: { top: number; left: number; width: number },
        closeMenu: () => void,
    ) => (
        <div
            data-investment-flyout={dept === "investment" ? true : undefined}
            data-franchise-flyout={dept === "franchise" ? true : undefined}
            className="fixed z-[100] rounded-xl border border-border bg-card py-1 shadow-xl"
            style={{
                top: flyout.top,
                left: flyout.left,
                width: flyout.width,
            }}
        >
            {sidebarNestedOrder[dept === "investment" ? "investment" : "franchiseDept"].map((childId) => {
                if (childId === "new-project") {
                    if (!canCreateInvestmentNav || committeeOpinionOnlyWorkflow) return null;
                    return (
                        <Link key={childId} to={workflowDeptHref(dept, "new-project", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                            className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${workflowDeptChildIsActive(location.pathname, location.search, dept, "new-project", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                            <PlusCircle className="w-4 h-4 shrink-0" /><span className="truncate">{t("investmentNewProject")}</span>
                        </Link>
                    );
                }
                if (childId === "opportunities") {
                    return (
                        <Link key={childId} to={workflowDeptHref(dept, "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                            className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${workflowDeptChildIsActive(location.pathname, location.search, dept, "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                            <ClipboardList className="w-4 h-4 shrink-0" /><span className="truncate">{dept === "franchise" ? t("franchiseOpportunities") : t("investmentOpportunities")}</span>
                        </Link>
                    );
                }
                if (childId === "investment-feasibility") {
                    if (committeeOpinionOnlyWorkflow) return null;
                    return (
                        <Link key={childId} to={workflowDeptHref(dept, "investment-feasibility", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                            className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${workflowDeptChildIsActive(location.pathname, location.search, dept, "investment-feasibility", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                            <BookOpen className="w-4 h-4 shrink-0" /><span className="truncate">{t("investmentFeasibilityStudy")}</span>
                        </Link>
                    );
                }
                if (childId === "opinions") {
                    return (
                        <Link key={childId} to={workflowDeptHref(dept, "opinions", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                            className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${workflowDeptChildIsActive(location.pathname, location.search, dept, "opinions", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                            <User className="w-4 h-4 shrink-0" /><span className="truncate">{dept === "franchise" ? t("franchiseOpinions") : t("investmentOpinions")}</span>
                        </Link>
                    );
                }
                return (
                    <Link key={childId} to="/all-stations-reports" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-reports" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                        <FileText className="w-4 h-4 shrink-0" /><span className="truncate">{t("reports")}</span>
                    </Link>
                );
            })}
        </div>
    );

    const renderDashboardFlyout = (
        flyout: { top: number; left: number; width: number },
        closeMenu: () => void,
    ) => (
        <div
            data-dashboard-flyout
            className="fixed z-[100] rounded-xl border border-border bg-card py-1 shadow-xl"
            style={{
                top: flyout.top,
                left: flyout.left,
                width: flyout.width,
            }}
        >
            {sidebarNestedOrder.dashboard.map((childId) => {
                if (childId === "dashboard") {
                    return <Link key={childId} to="/all-stations-dashboard" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-dashboard" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><LayoutDashboard className="w-4 h-4 shrink-0" /><span className="truncate">{t("dashboard")}</span></Link>;
                }
                if (childId === "analytics") {
                    return <Link key={childId} to="/all-stations-analytics" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-analytics" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><Activity className="w-4 h-4 shrink-0" /><span className="truncate">{t("analytics")}</span></Link>;
                }
                if (childId === "recentActivities") {
                    return <Link key={childId} to="/all-stations-recent-activities" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-recent-activities" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><History className="w-4 h-4 shrink-0" /><span className="truncate">{t("recentActivities")}</span></Link>;
                }
                if (childId === "underReview") {
                    return <Link key={childId} to="/all-stations-under-review" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-under-review" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><Clock className="w-4 h-4 shrink-0" /><span className="truncate">{t("underReview")}</span></Link>;
                }
                if (childId === "investmentOpportunities") {
                    if (!showInvestmentMenu) return null;
                    return <Link key={childId} to={workflowDeptHref("investment", "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${workflowDeptChildIsActive(location.pathname, location.search, "investment", "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><ClipboardList className="w-4 h-4 shrink-0" /><span className="truncate">{t("investmentOpportunities")}</span></Link>;
                }
                if (childId === "franchiseOpportunities") {
                    if (!showFranchiseMenu) return null;
                    return <Link key={childId} to={workflowDeptHref("franchise", "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${workflowDeptChildIsActive(location.pathname, location.search, "franchise", "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><ClipboardList className="w-4 h-4 shrink-0" /><span className="truncate">{t("franchiseOpportunities")}</span></Link>;
                }
                if (childId === "quickActions") {
                    return <div key={childId} className="flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium text-foreground/60"><PlusCircle className="w-4 h-4 shrink-0" /><span className="truncate">{t("quickActions")}</span></div>;
                }
                return <div key={childId} className="flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium text-foreground/60"><Bell className="w-4 h-4 shrink-0" /><span className="truncate">{t("alertsNotifications")}</span></div>;
            })}
        </div>
    );

    const renderLegalFlyout = (
        flyout: { top: number; left: number; width: number },
        closeMenu: () => void,
    ) => (
        <div
            data-legal-flyout
            className="fixed z-[100] rounded-xl border border-border bg-card py-1 shadow-xl"
            style={{ top: flyout.top, left: flyout.left, width: flyout.width }}
        >
            {sidebarNestedOrder.legalDept.map((childId) => {
                if (childId === "contract") {
                    return (
                        <Link key={childId} to="/all-stations-legal" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                            className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-legal" && !location.search.includes("tab=document") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                            <FileText className="w-4 h-4 shrink-0" /><span className="truncate">{t("contract")}</span>
                        </Link>
                    );
                }
                if (childId === "document") {
                    return (
                        <Link key={childId} to="/all-stations-legal?tab=document" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                            className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-legal" && location.search.includes("tab=document") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                            <FileText className="w-4 h-4 shrink-0" /><span className="truncate">{t("document")}</span>
                        </Link>
                    );
                }
                return (
                    <Link key={childId} to="/all-stations-reports" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-reports" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                        <BarChart2 className="w-4 h-4 shrink-0" /><span className="truncate">{t("reports")}</span>
                    </Link>
                );
            })}
        </div>
    );
    const renderProjectFlyout = (
        flyout: { top: number; left: number; width: number },
        closeMenu: () => void,
    ) => (
        <div data-project-flyout className="fixed z-[100] rounded-xl border border-border bg-card py-1 shadow-xl" style={{ top: flyout.top, left: flyout.left, width: flyout.width }}>
            {filteredSidebarNestedOrder.projectDept.map((childId) => {
                if (childId === "stations") {
                    return <Link key={childId} to="/all-stations-list" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-list" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><BookOpen className="w-4 h-4 shrink-0" /><span className="truncate">{t("stations")}</span></Link>;
                }
                if (childId === "siteSurvey") {
                    return <Link key={childId} to="/all-stations-project?tab=siteSurvey" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-project" && location.search.includes("tab=siteSurvey") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><ClipboardList className="w-4 h-4 shrink-0" /><span className="truncate">{t("siteSurvey")}</span></Link>;
                }
                return <Link key={childId} to="/all-stations-reports" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-reports" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><FileText className="w-4 h-4 shrink-0" /><span className="truncate">{t("reports")}</span></Link>;
            })}
        </div>
    );
    const renderFeasibilityStudyFlyout = (
        flyout: { top: number; left: number; width: number },
        closeMenu: () => void,
    ) => (
        <div data-feasibility-study-flyout className="fixed z-[100] rounded-xl border border-border bg-card py-1 shadow-xl" style={{ top: flyout.top, left: flyout.left, width: flyout.width }}>
            {filteredSidebarNestedOrder.feasibilityStudy.map((childId) => {
                if (childId === "overview") {
                    return <Link key={childId} to="/all-stations-project?tab=feasibility" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-project" && location.search.includes("tab=feasibility") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><BookOpen className="w-4 h-4 shrink-0" /><span className="truncate">{t("projectFeasibilityStudy")}</span></Link>;
                }
                if (childId === "committeeOpinions") {
                    return <Link key={childId} to="/station/new-station/form/investment-department?tab=opinions" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname.includes("/investment-department") && location.search.includes("tab=opinions") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><User className="w-4 h-4 shrink-0" /><span className="truncate">{t("investmentOpinions")}</span></Link>;
                }
                return null;
            })}
        </div>
    );

    const renderPreOpeningFlyout = (
        flyout: { top: number; left: number; width: number },
        closeMenu: () => void,
    ) => (
        <div data-pre-opening-flyout className="fixed z-[100] rounded-xl border border-border bg-card py-1 shadow-xl" style={{ top: flyout.top, left: flyout.left, width: flyout.width }}>
            {filteredSidebarNestedOrder.preOpening.map((childId) => {
                if (childId === "governmentLicenses") {
                    return <Link key={childId} to="/all-stations-pre-opening" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-pre-opening" && !location.search.includes("tab=other") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><FileText className="w-4 h-4 shrink-0" /><span className="truncate">{t("governmentLicenses")}</span></Link>;
                }
                return <Link key={childId} to="/all-stations-pre-opening?tab=other" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-pre-opening" && location.search.includes("tab=other") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><FileText className="w-4 h-4 shrink-0" /><span className="truncate">{t("otherLicenses")}</span></Link>;
            })}
        </div>
    );
    const renderOrderRequestFlyout = (
        flyout: { top: number; left: number; width: number },
        closeMenu: () => void,
    ) => (
        <div data-order-request-flyout className="fixed z-[100] rounded-xl border border-border bg-card py-1 shadow-xl" style={{ top: flyout.top, left: flyout.left, width: flyout.width }}>
            {sidebarNestedOrder.orderRequest.map((childId) => {
                if (childId === "newRequest") {
                    return <Link key={childId} to="/all-stations-requests" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-requests" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><ClipboardList className="w-4 h-4 shrink-0" /><span className="truncate">{t("newRequest")}</span></Link>;
                }
                return <Link key={childId} to="/all-stations-order-requests-submitted" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-order-requests-submitted" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><CheckCircle className="w-4 h-4 shrink-0" /><span className="truncate">{t("submittedApprovedRequests")}</span></Link>;
            })}
        </div>
    );
    const renderOpeningSoonFlyout = (
        flyout: { top: number; left: number; width: number },
        closeMenu: () => void,
    ) => (
        <div data-opening-soon-flyout className="fixed z-[100] rounded-xl border border-border bg-card py-1 shadow-xl" style={{ top: flyout.top, left: flyout.left, width: flyout.width }}>
            {sidebarNestedOrder.openingSoonProjects.map((childId) => (
                <Link key={childId} to="/all-stations-opening-soon-projects" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-opening-soon-projects" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><Clock className="w-4 h-4 shrink-0" /><span className="truncate">{t("trackNearLaunchProject")}</span></Link>
            ))}
        </div>
    );
    const renderTasksMenuFlyout = (
        flyout: { top: number; left: number; width: number },
        closeMenu: () => void,
    ) => (
        <div data-tasks-menu-flyout className="fixed z-[100] rounded-xl border border-border bg-card py-1 shadow-xl" style={{ top: flyout.top, left: flyout.left, width: flyout.width }}>
            {sidebarNestedOrder.tasksMenu.map((childId) => (
                <Link key={childId} to="/all-stations-tasks" onClick={() => { closeMenu(); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-tasks" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}><ClipboardList className="w-4 h-4 shrink-0" /><span className="truncate flex-1 min-w-0">{t("tasks")}</span><TaskPendingBadge count={taskCount} /></Link>
            ))}
        </div>
    );

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
                        {resolvedSidebarSlots.map((slotId) => (
                            <AllStationsSidebarSlot key={slotId} slotId={slotId} ctx={sidebarNavCtx} />
                        ))}
                        <button
                            onClick={handleChatClick}
                            className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg transition-all duration-200 text-white/80 hover:bg-white/15 hover:text-white relative`}
                            title={!sidebarOpen ? t("chat") : undefined}
                        >
                            <MessageCircle className="w-5 h-5" />
                            {sidebarOpen && (
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-sm font-medium truncate">{t("chat")}</span>
                                    <span className="min-w-5 h-5 px-1.5 bg-info text-info-foreground rounded-full flex items-center justify-center text-[10px] font-bold leading-none shadow-sm">
                                        3
                                    </span>
                                </div>
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

                {typeof document !== "undefined" &&
                    systemSettingsOpen &&
                    !sidebarOpen &&
                    systemSettingsFlyout &&
                    (showSystemUsers || showCompanyInfo || showUserSettings) &&
                    createPortal(
                        <div
                            data-system-settings-flyout
                            className="fixed z-[100] rounded-xl border border-border bg-card py-1 shadow-xl"
                            style={{
                                top: systemSettingsFlyout.top,
                                left: systemSettingsFlyout.left,
                                width: systemSettingsFlyout.width,
                            }}
                        >
                            {sidebarNestedOrder.systemSettings.map((childId) => {
                                if (childId === "users") {
                                    if (!showSystemUsers) return null;
                                    return (
                                        <Link key={childId} to="/all-stations-users" onClick={() => { setSystemSettingsOpen(false); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                            className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-users" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                                            <Users className="w-4 h-4 shrink-0" /><span className="truncate">{t("users")}</span>
                                        </Link>
                                    );
                                }
                                if (childId === "userSettings") {
                                    if (!showUserSettings) return null;
                                    return (
                                        <Link key={childId} to="/all-stations-settings/preferences" onClick={() => { setSystemSettingsOpen(false); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                            className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-settings/preferences" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                                            <Settings className="w-4 h-4 shrink-0" /><span className="truncate">{t("settings")}</span>
                                        </Link>
                                    );
                                }
                                if (childId === "companyInfo") {
                                    if (!showCompanyInfo) return null;
                                    return (
                                        <Link key={childId} to="/all-stations-settings" onClick={() => { setSystemSettingsOpen(false); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                            className={`flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/all-stations-settings" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                                            <Settings className="w-4 h-4 shrink-0" /><span className="truncate">{t("companyInfo")}</span>
                                        </Link>
                                    );
                                }
                                if (childId === "notifications") {
                                    return <div key={childId} className="flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium text-foreground/60"><Bell className="w-4 h-4 shrink-0" /><span className="truncate">{t("notifications")}</span></div>;
                                }
                                return <div key={childId} className="flex items-center gap-2 px-3 py-2.5 mx-1 rounded-lg text-sm font-medium text-foreground/60"><DatabaseBackup className="w-4 h-4 shrink-0" /><span className="truncate">{t("backup")}</span></div>;
                            })}
                        </div>,
                        document.body
                    )}

                {typeof document !== "undefined" &&
                    dashboardMenuOpen &&
                    !sidebarOpen &&
                    dashboardFlyout &&
                    createPortal(
                        renderDashboardFlyout(dashboardFlyout, () => setDashboardMenuOpen(false)),
                        document.body
                    )}

                {typeof document !== "undefined" &&
                    legalMenuOpen &&
                    showLegalMenu &&
                    !sidebarOpen &&
                    legalFlyout &&
                    createPortal(
                        renderLegalFlyout(legalFlyout, () => setLegalMenuOpen(false)),
                        document.body
                    )}

                {typeof document !== "undefined" &&
                    orderRequestMenuOpen &&
                    showOrderRequestMenu &&
                    !sidebarOpen &&
                    orderRequestFlyout &&
                    createPortal(
                        renderOrderRequestFlyout(orderRequestFlyout, () => setOrderRequestMenuOpen(false)),
                        document.body
                    )}

                {typeof document !== "undefined" &&
                    openingSoonMenuOpen &&
                    showOpeningSoonMenu &&
                    !sidebarOpen &&
                    openingSoonFlyout &&
                    createPortal(
                        renderOpeningSoonFlyout(openingSoonFlyout, () => setOpeningSoonMenuOpen(false)),
                        document.body
                    )}

                {typeof document !== "undefined" &&
                    tasksMenuOpen &&
                    showTasksMenu &&
                    !sidebarOpen &&
                    tasksMenuFlyout &&
                    createPortal(
                        renderTasksMenuFlyout(tasksMenuFlyout, () => setTasksMenuOpen(false)),
                        document.body
                    )}

                {typeof document !== "undefined" &&
                    preOpeningMenuOpen &&
                    showPreOpeningMenu &&
                    !sidebarOpen &&
                    preOpeningFlyout &&
                    createPortal(
                        renderPreOpeningFlyout(preOpeningFlyout, () => setPreOpeningMenuOpen(false)),
                        document.body
                    )}

                {typeof document !== "undefined" &&
                    feasibilityStudyMenuOpen &&
                    showFeasibilityStudyMenu &&
                    !sidebarOpen &&
                    feasibilityStudyFlyout &&
                    createPortal(
                        renderFeasibilityStudyFlyout(feasibilityStudyFlyout, () => setFeasibilityStudyMenuOpen(false)),
                        document.body
                    )}

                {typeof document !== "undefined" &&
                    projectMenuOpen &&
                    showProjectMenu &&
                    !sidebarOpen &&
                    projectFlyout &&
                    createPortal(
                        renderProjectFlyout(projectFlyout, () => setProjectMenuOpen(false)),
                        document.body
                    )}

                {typeof document !== "undefined" &&
                    investmentMenuOpen &&
                    showInvestmentMenu &&
                    !sidebarOpen &&
                    investmentFlyout &&
                    createPortal(
                        renderWorkflowFlyout("investment", investmentFlyout, () => setInvestmentMenuOpen(false)),
                        document.body
                    )}

                {typeof document !== "undefined" &&
                    franchiseMenuOpen &&
                    showFranchiseMenu &&
                    !sidebarOpen &&
                    franchiseFlyout &&
                    createPortal(
                        renderWorkflowFlyout("franchise", franchiseFlyout, () => setFranchiseMenuOpen(false)),
                        document.body
                    )}

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
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <h2 className="text-xs sm:text-sm font-bold truncate">{t("allStations")}</h2>
                            {user && (
                                <span className="hidden sm:inline text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                                    {getRoleLabel(user.role)}
                                </span>
                            )}
                        </div>
                        <LanguageSwitcher />
                    </div>

                    {/* Desktop Header */}
                    <header className="hidden lg:flex bg-card/80 backdrop-blur-xl m-4 rounded-2xl border border-border px-4 md:px-6 lg:px-8 py-4 sticky top-4 z-10 shadow-lg shadow-primary/10 items-center justify-between flex-wrap gap-4">
                        <BackToDashboardButton />
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* User info badge */}
                            {user && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/8 border border-primary/20 rounded-lg">
                                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-white uppercase">{user.username[0]}</span>
                                    </div>
                                    <div className="leading-none">
                                        <p className="text-xs font-semibold text-foreground">{user.username}</p>
                                        <p className="text-[10px] text-muted-foreground">Role: {getRoleLabel(user.role)}</p>
                                    </div>
                                </div>
                            )}
                            {!isDeptUser && (
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
                            )}
                            {!isDeptUser && (user?.role === 'super_admin' || user?.role === 'ceo') && (
                                <Link
                                    to="/station/new-station/form/investment-department?tab=new-project"
                                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-xs md:text-sm"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span className="hidden sm:inline">{t("addNewProject")}</span>
                                    <span className="sm:hidden">{t("addNewProject").split(" ")[0]}</span>
                                </Link>
                            )}
                            {canShowDepartmentAddButton && (
                                <Link
                                    to={addProjectPath}
                                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-xs md:text-sm"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span className="hidden sm:inline">{t("addNewProject")}</span>
                                    <span className="sm:hidden">{t("addNewProject").split(" ")[0]}</span>
                                </Link>
                            )}
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

