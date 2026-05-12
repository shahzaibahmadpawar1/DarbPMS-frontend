import { type RefObject } from "react";
import { Link, type Location } from "react-router-dom";
import {
    LayoutDashboard,
    Activity,
    History,
    PlusCircle,
    ClipboardList,
    Users,
    Settings,
    ChevronDown,
    TrendingUp,
    BookOpen,
    User,
    FileText,
    CheckCircle,
    Zap,
    BellRing,
    Bell,
    DatabaseBackup,
    Clock,
} from "lucide-react";
import {
    workflowDeptHref,
    workflowDeptChildIsActive,
    type WorkflowDepartmentType,
} from "@/utils/investmentDepartmentNav";
import type { SidebarNestedOrder } from "@/utils/sidebarNestedOrder";

export interface NavItem {
    titleKey:
        | "dashboard"
        | "analytics"
        | "stations"
        | "departments"
        | "tasks"
        | "reports"
        | "contactCEO"
        | "requests"
        | "underReview"
        | "franchiseDept"
        | "legalDept"
        | "projectDept"
        | "preOpening"
        | "orderRequest"
        | "openingSoonProjects"
        | "tasksMenu"
        | "recentActivities";
    path: string;
    icon: React.ReactNode;
}

export interface SidebarNavRenderContext {
    navigation: NavItem[];
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    location: Location;
    t: (key: string) => string;
    taskCount: number;
    underReviewCount: number;
    isDeptUser: boolean;
    showSystemUsers: boolean;
    showSystemSettings: boolean;
    sidebarNestedOrder: SidebarNestedOrder;
    projectMenuOpen: boolean;
    setProjectMenuOpen: (fn: (o: boolean) => boolean) => void;
    isProjectRoute: boolean;
    showProjectMenu: boolean;
    preOpeningMenuOpen: boolean;
    setPreOpeningMenuOpen: (fn: (o: boolean) => boolean) => void;
    isPreOpeningRoute: boolean;
    showPreOpeningMenu: boolean;
    orderRequestMenuOpen: boolean;
    setOrderRequestMenuOpen: (fn: (o: boolean) => boolean) => void;
    isOrderRequestRoute: boolean;
    showOrderRequestMenu: boolean;
    openingSoonMenuOpen: boolean;
    setOpeningSoonMenuOpen: (fn: (o: boolean) => boolean) => void;
    isOpeningSoonRoute: boolean;
    showOpeningSoonMenu: boolean;
    tasksMenuOpen: boolean;
    setTasksMenuOpen: (fn: (o: boolean) => boolean) => void;
    isTasksMenuRoute: boolean;
    showTasksMenu: boolean;
    dashboardMenuOpen: boolean;
    setDashboardMenuOpen: (fn: (o: boolean) => boolean) => void;
    isDashboardGroupRoute: boolean;
    legalMenuOpen: boolean;
    setLegalMenuOpen: (fn: (o: boolean) => boolean) => void;
    isLegalRoute: boolean;
    showLegalMenu: boolean;
    investmentMenuOpen: boolean;
    setInvestmentMenuOpen: (fn: (o: boolean) => boolean) => void;
    franchiseMenuOpen: boolean;
    setFranchiseMenuOpen: (fn: (o: boolean) => boolean) => void;
    isInvestmentDeptRoute: boolean;
    isFranchiseDeptRoute: boolean;
    canCreateInvestmentNav: boolean;
    showInvestmentMenu: boolean;
    showFranchiseMenu: boolean;
    committeeOpinionOnlyWorkflow: boolean;
    systemSettingsOpen: boolean;
    setSystemSettingsOpen: (fn: (o: boolean) => boolean) => void;
    isSystemSettingsRoute: boolean;
    projectWrapRef: RefObject<HTMLDivElement | null>;
    preOpeningWrapRef: RefObject<HTMLDivElement | null>;
    orderRequestWrapRef: RefObject<HTMLDivElement | null>;
    openingSoonWrapRef: RefObject<HTMLDivElement | null>;
    tasksMenuWrapRef: RefObject<HTMLDivElement | null>;
    dashboardWrapRef: RefObject<HTMLDivElement | null>;
    legalWrapRef: RefObject<HTMLDivElement | null>;
    investmentWrapRef: RefObject<HTMLDivElement | null>;
    franchiseWrapRef: RefObject<HTMLDivElement | null>;
    systemSettingsWrapRef: RefObject<HTMLDivElement | null>;
}

export function AllStationsSidebarSlot({
    slotId,
    ctx,
}: {
    slotId: string;
    ctx: SidebarNavRenderContext;
}) {
    const {
        navigation,
        sidebarOpen,
        setSidebarOpen,
        location,
        t,
        taskCount,
        underReviewCount,
        isDeptUser,
        showSystemUsers,
        showSystemSettings,
        sidebarNestedOrder,
        projectMenuOpen,
        setProjectMenuOpen,
        isProjectRoute,
        showProjectMenu,
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
    } = ctx;

    if (slotId === "projectDept") {
        if (!showProjectMenu) return null;
        return (
            <div ref={projectWrapRef} className={sidebarOpen ? "space-y-1" : "relative z-[55]"}>
                <button type="button" onClick={() => setProjectMenuOpen((open) => !open)}
                    className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-4" : "justify-center px-2"} py-3 rounded-lg transition-all duration-200 ${sidebarOpen ? (projectMenuOpen || isProjectRoute ? "bg-white/15 text-white shadow-md" : "text-white/80 hover:bg-white/15 hover:text-white") : (projectMenuOpen || isProjectRoute ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/15 hover:text-white")}`}
                    title={!sidebarOpen ? t("projectDept") : undefined}
                    aria-expanded={projectMenuOpen}
                >
                    <BookOpen className="w-5 h-5 shrink-0" />
                    {sidebarOpen && (
                        <>
                            <span className="flex-1 min-w-0 text-start text-sm font-semibold truncate">{t("projectDept")}</span>
                            <ChevronDown className={`w-4 h-4 shrink-0 text-white/90 transition-transform duration-200 ${projectMenuOpen ? "rotate-180" : ""}`} aria-hidden />
                        </>
                    )}
                </button>
                {sidebarOpen && projectMenuOpen && (
                    <div className="ms-2 border-s border-white/25 ps-3 space-y-1 pb-1">
                        {sidebarNestedOrder.projectDept.map((childId) => {
                            if (childId === "newProject") {
                                return (
                                    <div key={childId} className="space-y-1">
                                        <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-white/90">
                                            <PlusCircle className="w-5 h-5 shrink-0" /><span className="truncate">{t("projectNewProject")}</span>
                                        </div>
                                        <Link to="/station/new-station/form/investment-department?tab=new-project" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                            className={`ms-6 flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname.includes("/investment-department") ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                            <span className="truncate">{t("investmentDept")}</span>
                                        </Link>
                                        <Link to="/station/new-station/form/franchise-department?tab=new-project" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                            className={`ms-6 flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname.includes("/franchise-department") ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                            <span className="truncate">{t("franchiseDept")}</span>
                                        </Link>
                                    </div>
                                );
                            }
                            if (childId === "feasibility") {
                                return <Link key={childId} to="/all-stations-project?tab=feasibility" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${(location.pathname === "/all-stations-project" && location.search.includes("tab=feasibility")) ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                    <BookOpen className="w-5 h-5 shrink-0" /><span className="truncate">{t("projectFeasibilityStudy")}</span>
                                </Link>;
                            }
                            if (childId === "stations") {
                                return <Link key={childId} to="/all-stations-list" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-list" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                    <BookOpen className="w-5 h-5 shrink-0" /><span className="truncate">{t("stations")}</span>
                                </Link>;
                            }
                            if (childId === "siteSurvey") {
                                return <Link key={childId} to="/all-stations-project?tab=siteSurvey" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${(location.pathname === "/all-stations-project" && location.search.includes("tab=siteSurvey")) ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                    <ClipboardList className="w-5 h-5 shrink-0" /><span className="truncate">{t("siteSurvey")}</span>
                                </Link>;
                            }
                            return <Link key={childId} to="/all-stations-reports" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-reports" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                <FileText className="w-5 h-5 shrink-0" /><span className="truncate">{t("reports")}</span>
                            </Link>;
                        })}
                    </div>
                )}
            </div>
        );
    }

    if (slotId === "preOpening") {
        if (!showPreOpeningMenu) return null;
        return (
            <div ref={preOpeningWrapRef} className={sidebarOpen ? "space-y-1" : "relative z-[55]"}>
                <button type="button" onClick={() => setPreOpeningMenuOpen((open) => !open)}
                    className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-4" : "justify-center px-2"} py-3 rounded-lg transition-all duration-200 ${sidebarOpen ? (preOpeningMenuOpen || isPreOpeningRoute ? "bg-white/15 text-white shadow-md" : "text-white/80 hover:bg-white/15 hover:text-white") : (preOpeningMenuOpen || isPreOpeningRoute ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/15 hover:text-white")}`}
                    title={!sidebarOpen ? t("preOpening") : undefined}
                    aria-expanded={preOpeningMenuOpen}
                >
                    <FileText className="w-5 h-5 shrink-0" />
                    {sidebarOpen && (
                        <>
                            <span className="flex-1 min-w-0 text-start text-sm font-semibold truncate">{t("preOpening")}</span>
                            <ChevronDown className={`w-4 h-4 shrink-0 text-white/90 transition-transform duration-200 ${preOpeningMenuOpen ? "rotate-180" : ""}`} aria-hidden />
                        </>
                    )}
                </button>
                {sidebarOpen && preOpeningMenuOpen && (
                    <div className="ms-2 border-s border-white/25 ps-3 space-y-1 pb-1">
                        {sidebarNestedOrder.preOpening.map((childId) => {
                            if (childId === "governmentLicenses") {
                                return <Link key={childId} to="/all-stations-pre-opening" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-pre-opening" && !location.search.includes("tab=other") ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                    <FileText className="w-5 h-5 shrink-0" /><span className="truncate">{t("governmentLicenses")}</span>
                                </Link>;
                            }
                            return <Link key={childId} to="/all-stations-pre-opening?tab=other" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-pre-opening" && location.search.includes("tab=other") ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                <FileText className="w-5 h-5 shrink-0" /><span className="truncate">{t("otherLicenses")}</span>
                            </Link>;
                        })}
                    </div>
                )}
            </div>
        );
    }

    if (slotId === "orderRequest") {
        if (!showOrderRequestMenu) return null;
        return (
            <div ref={orderRequestWrapRef} className={sidebarOpen ? "space-y-1" : "relative z-[55]"}>
                <button type="button" onClick={() => setOrderRequestMenuOpen((open) => !open)}
                    className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-4" : "justify-center px-2"} py-3 rounded-lg transition-all duration-200 ${sidebarOpen ? (orderRequestMenuOpen || isOrderRequestRoute ? "bg-white/15 text-white shadow-md" : "text-white/80 hover:bg-white/15 hover:text-white") : (orderRequestMenuOpen || isOrderRequestRoute ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/15 hover:text-white")}`}
                    title={!sidebarOpen ? t("orderRequest") : undefined}
                    aria-expanded={orderRequestMenuOpen}
                >
                    <ClipboardList className="w-5 h-5 shrink-0" />
                    {sidebarOpen && (
                        <>
                            <span className="flex-1 min-w-0 text-start text-sm font-semibold truncate">{t("orderRequest")}</span>
                            <ChevronDown className={`w-4 h-4 shrink-0 text-white/90 transition-transform duration-200 ${orderRequestMenuOpen ? "rotate-180" : ""}`} aria-hidden />
                        </>
                    )}
                </button>
                {sidebarOpen && orderRequestMenuOpen && (
                    <div className="ms-2 border-s border-white/25 ps-3 space-y-1 pb-1">
                        {sidebarNestedOrder.orderRequest.map((childId) => {
                            if (childId === "newRequest") {
                                return <Link key={childId} to="/all-stations-requests" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-requests" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                    <ClipboardList className="w-5 h-5 shrink-0" /><span className="truncate">{t("newRequest")}</span>
                                </Link>;
                            }
                            return <Link key={childId} to="/all-stations-order-requests-submitted" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-order-requests-submitted" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                <CheckCircle className="w-5 h-5 shrink-0" /><span className="truncate">{t("submittedApprovedRequests")}</span>
                            </Link>;
                        })}
                    </div>
                )}
            </div>
        );
    }

    if (slotId === "openingSoonProjects") {
        if (!showOpeningSoonMenu) return null;
        return (
            <div ref={openingSoonWrapRef} className={sidebarOpen ? "space-y-1" : "relative z-[55]"}>
                <button type="button" onClick={() => setOpeningSoonMenuOpen((open) => !open)}
                    className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-4" : "justify-center px-2"} py-3 rounded-lg transition-all duration-200 ${sidebarOpen ? (openingSoonMenuOpen || isOpeningSoonRoute ? "bg-white/15 text-white shadow-md" : "text-white/80 hover:bg-white/15 hover:text-white") : (openingSoonMenuOpen || isOpeningSoonRoute ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/15 hover:text-white")}`}
                    title={!sidebarOpen ? t("openingSoonProjects") : undefined}
                    aria-expanded={openingSoonMenuOpen}
                >
                    <Clock className="w-5 h-5 shrink-0" />
                    {sidebarOpen && (
                        <>
                            <span className="flex-1 min-w-0 text-start text-sm font-semibold truncate">{t("openingSoonProjects")}</span>
                            <ChevronDown className={`w-4 h-4 shrink-0 text-white/90 transition-transform duration-200 ${openingSoonMenuOpen ? "rotate-180" : ""}`} aria-hidden />
                        </>
                    )}
                </button>
                {sidebarOpen && openingSoonMenuOpen && (
                    <div className="ms-2 border-s border-white/25 ps-3 space-y-1 pb-1">
                        {sidebarNestedOrder.openingSoonProjects.map((childId) => (
                            <Link key={childId} to="/all-stations-opening-soon-projects" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-opening-soon-projects" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                <Clock className="w-5 h-5 shrink-0" /><span className="truncate">{t("trackNearLaunchProject")}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (slotId === "tasksMenu") {
        if (!showTasksMenu) return null;
        return (
            <div ref={tasksMenuWrapRef} className={sidebarOpen ? "space-y-1" : "relative z-[55]"}>
                <button type="button" onClick={() => setTasksMenuOpen((open) => !open)}
                    className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-4" : "justify-center px-2"} py-3 rounded-lg transition-all duration-200 ${sidebarOpen ? (tasksMenuOpen || isTasksMenuRoute ? "bg-white/15 text-white shadow-md" : "text-white/80 hover:bg-white/15 hover:text-white") : (tasksMenuOpen || isTasksMenuRoute ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/15 hover:text-white")}`}
                    title={!sidebarOpen ? t("tasksMenu") : undefined}
                    aria-expanded={tasksMenuOpen}
                >
                    <ClipboardList className="w-5 h-5 shrink-0" />
                    {sidebarOpen && (
                        <>
                            <span className="flex-1 min-w-0 text-start text-sm font-semibold truncate">{t("tasksMenu")}</span>
                            <ChevronDown className={`w-4 h-4 shrink-0 text-white/90 transition-transform duration-200 ${tasksMenuOpen ? "rotate-180" : ""}`} aria-hidden />
                        </>
                    )}
                </button>
                {sidebarOpen && tasksMenuOpen && (
                    <div className="ms-2 border-s border-white/25 ps-3 space-y-1 pb-1">
                        {sidebarNestedOrder.tasksMenu.map((childId) => (
                            <Link key={childId} to="/all-stations-tasks" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-tasks" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                <ClipboardList className="w-5 h-5 shrink-0" /><span className="truncate">{t("tasks")}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (slotId === "dashboard") {
        return (
            <div ref={dashboardWrapRef} className={sidebarOpen ? "space-y-1" : "relative z-[55]"}>
                <button
                    type="button"
                    onClick={() => setDashboardMenuOpen((open) => !open)}
                    className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-4" : "justify-center px-2"} py-3 rounded-lg transition-all duration-200 ${sidebarOpen
                        ? dashboardMenuOpen || isDashboardGroupRoute
                            ? "bg-white/15 text-white shadow-md"
                            : "text-white/80 hover:bg-white/15 hover:text-white"
                        : dashboardMenuOpen || isDashboardGroupRoute
                            ? "bg-white/15 text-white"
                            : "text-white/80 hover:bg-white/15 hover:text-white"
                        }`}
                    title={!sidebarOpen ? t("dashboard") : undefined}
                    aria-expanded={dashboardMenuOpen}
                >
                    <LayoutDashboard className="w-5 h-5 shrink-0" />
                    {sidebarOpen && (
                        <>
                            <span className="flex-1 min-w-0 text-start text-sm font-semibold truncate">{t("dashboard")}</span>
                            <ChevronDown
                                className={`w-4 h-4 shrink-0 text-white/90 transition-transform duration-200 ${dashboardMenuOpen ? "rotate-180" : ""}`}
                                aria-hidden
                            />
                        </>
                    )}
                </button>
                {sidebarOpen && dashboardMenuOpen && (
                    <div className="ms-2 border-s border-white/25 ps-3 space-y-1 pb-1">
                        {sidebarNestedOrder.dashboard.map((childId) => {
                            if (childId === "dashboard") {
                                return (
                                    <Link key={childId} to="/all-stations-dashboard" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-dashboard" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                        <LayoutDashboard className="w-5 h-5 shrink-0" /><span className="truncate">{t("dashboard")}</span>
                                    </Link>
                                );
                            }
                            if (childId === "analytics") {
                                return (
                                    <Link key={childId} to="/all-stations-analytics" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-analytics" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                        <Activity className="w-5 h-5 shrink-0" /><span className="truncate">{t("analytics")}</span>
                                    </Link>
                                );
                            }
                            if (childId === "recentActivities") {
                                return (
                                    <Link key={childId} to="/all-stations-recent-activities" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-recent-activities" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                        <History className="w-5 h-5 shrink-0" /><span className="truncate">{t("recentActivities")}</span>
                                    </Link>
                                );
                            }
                            if (childId === "underReview") {
                                return (
                                    <Link key={childId} to="/all-stations-under-review" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-under-review" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                        <Clock className="w-5 h-5 shrink-0" /><span className="truncate">{t("underReview")}</span>
                                    </Link>
                                );
                            }
                            if (childId === "investmentOpportunities") {
                                if (!showInvestmentMenu) return null;
                                return (
                                    <Link key={childId} to={workflowDeptHref("investment", "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${workflowDeptChildIsActive(location.pathname, location.search, "investment", "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                        <ClipboardList className="w-5 h-5 shrink-0" /><span className="truncate">{t("investmentOpportunities")}</span>
                                    </Link>
                                );
                            }
                            if (childId === "franchiseOpportunities") {
                                if (!showFranchiseMenu) return null;
                                return (
                                    <Link key={childId} to={workflowDeptHref("franchise", "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${workflowDeptChildIsActive(location.pathname, location.search, "franchise", "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                        <ClipboardList className="w-5 h-5 shrink-0" /><span className="truncate">{t("franchiseOpportunities")}</span>
                                    </Link>
                                );
                            }
                            if (childId === "quickActions") {
                                return <div key={childId} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-white/65"><Zap className="w-5 h-5 shrink-0" /><span className="truncate">{t("quickActions")}</span></div>;
                            }
                            return <div key={childId} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-white/65"><BellRing className="w-5 h-5 shrink-0" /><span className="truncate">{t("alertsNotifications")}</span></div>;
                        })}
                    </div>
                )}
            </div>
        );
    }

    const renderWorkflowMenu = ({
        dept,
        title,
        open,
        setOpen,
        isRoute,
        wrapRef,
    }: {
        dept: WorkflowDepartmentType;
        title: string;
        open: boolean;
        setOpen: (fn: (o: boolean) => boolean) => void;
        isRoute: boolean;
        wrapRef: RefObject<HTMLDivElement | null>;
    }) => {
        return (
            <div ref={wrapRef} className={sidebarOpen ? "space-y-1" : "relative z-[55]"}>
                    <button
                        type="button"
                        onClick={() => setOpen((wasOpen) => !wasOpen)}
                        className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-4" : "justify-center px-2"} py-3 rounded-lg transition-all duration-200 ${sidebarOpen
                            ? open || isRoute
                                ? "bg-white/15 text-white shadow-md"
                                : "text-white/80 hover:bg-white/15 hover:text-white"
                            : open || isRoute
                                ? "bg-white/15 text-white"
                                : "text-white/80 hover:bg-white/15 hover:text-white"
                            }`}
                        title={!sidebarOpen ? title : undefined}
                        aria-expanded={open}
                    >
                        <TrendingUp className="w-5 h-5 shrink-0" />
                        {sidebarOpen && (
                            <>
                                <span className="flex-1 min-w-0 text-start text-sm font-semibold truncate">
                                    {title}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 shrink-0 text-white/90 transition-transform duration-200 ${open ? "rotate-180" : ""
                                        }`}
                                    aria-hidden
                                />
                            </>
                        )}
                    </button>
                    {sidebarOpen && open && (
                        <div className="ms-2 border-s border-white/25 ps-3 space-y-1 pb-1">
                            {sidebarNestedOrder[dept === "investment" ? "investment" : "franchiseDept"].map((childId) => {
                                if (childId === "new-project") {
                                    if (!canCreateInvestmentNav || committeeOpinionOnlyWorkflow) return null;
                                    return <Link key={childId} to={workflowDeptHref(dept, "new-project", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${workflowDeptChildIsActive(location.pathname, location.search, dept, "new-project", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                        <PlusCircle className="w-5 h-5 shrink-0" /><span className="truncate">{t("investmentNewProject")}</span></Link>;
                                }
                                if (childId === "opportunities") {
                                    return <Link key={childId} to={workflowDeptHref(dept, "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${workflowDeptChildIsActive(location.pathname, location.search, dept, "opportunities", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                        <ClipboardList className="w-5 h-5 shrink-0" /><span className="truncate">{dept === "franchise" ? t("franchiseOpportunities") : t("investmentOpportunities")}</span></Link>;
                                }
                                if (childId === "investment-feasibility") {
                                    if (committeeOpinionOnlyWorkflow) return null;
                                    return <Link key={childId} to={workflowDeptHref(dept, "investment-feasibility", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${workflowDeptChildIsActive(location.pathname, location.search, dept, "investment-feasibility", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                        <BookOpen className="w-5 h-5 shrink-0" /><span className="truncate">{t("investmentFeasibilityStudy")}</span></Link>;
                                }
                                if (childId === "opinions") {
                                    return <Link key={childId} to={workflowDeptHref(dept, "opinions", canCreateInvestmentNav, committeeOpinionOnlyWorkflow)} onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${workflowDeptChildIsActive(location.pathname, location.search, dept, "opinions", canCreateInvestmentNav, committeeOpinionOnlyWorkflow) ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                        <User className="w-5 h-5 shrink-0" /><span className="truncate">{dept === "franchise" ? t("franchiseOpinions") : t("investmentOpinions")}</span></Link>;
                                }
                                return <Link key={childId} to="/all-stations-reports" onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-reports" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                    <FileText className="w-5 h-5 shrink-0" /><span className="truncate">{t("reports")}</span></Link>;
                            })}
                        </div>
                    )}
            </div>
        );
    };

    if (slotId === "investment") {
        if (!showInvestmentMenu) return null;
        return renderWorkflowMenu({
            dept: "investment",
            title: t("investmentDept"),
            open: investmentMenuOpen,
            setOpen: setInvestmentMenuOpen,
            isRoute: isInvestmentDeptRoute,
            wrapRef: investmentWrapRef,
        });
    }

    if (slotId === "franchiseDept") {
        if (!showFranchiseMenu) return null;
        return renderWorkflowMenu({
            dept: "franchise",
            title: t("franchiseDept"),
            open: franchiseMenuOpen,
            setOpen: setFranchiseMenuOpen,
            isRoute: isFranchiseDeptRoute,
            wrapRef: franchiseWrapRef,
        });
    }

    if (slotId === "legalDept") {
        if (!showLegalMenu) return null;
        return (
            <div ref={legalWrapRef} className={sidebarOpen ? "space-y-1" : "relative z-[55]"}>
                <button
                    type="button"
                    onClick={() => setLegalMenuOpen((open) => !open)}
                    className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-4" : "justify-center px-2"} py-3 rounded-lg transition-all duration-200 ${sidebarOpen
                        ? legalMenuOpen || isLegalRoute
                            ? "bg-white/15 text-white shadow-md"
                            : "text-white/80 hover:bg-white/15 hover:text-white"
                        : legalMenuOpen || isLegalRoute
                            ? "bg-white/15 text-white"
                            : "text-white/80 hover:bg-white/15 hover:text-white"
                        }`}
                    title={!sidebarOpen ? t("legalDept") : undefined}
                    aria-expanded={legalMenuOpen}
                >
                    <FileText className="w-5 h-5 shrink-0" />
                    {sidebarOpen && (
                        <>
                            <span className="flex-1 min-w-0 text-start text-sm font-semibold truncate">{t("legalDept")}</span>
                            <ChevronDown className={`w-4 h-4 shrink-0 text-white/90 transition-transform duration-200 ${legalMenuOpen ? "rotate-180" : ""}`} aria-hidden />
                        </>
                    )}
                </button>
                {sidebarOpen && legalMenuOpen && (
                    <div className="ms-2 border-s border-white/25 ps-3 space-y-1 pb-1">
                        {sidebarNestedOrder.legalDept.map((childId) => {
                            if (childId === "contract") {
                                return <Link key={childId} to="/all-stations-legal" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-legal" && !location.search.includes("tab=document") ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                    <FileText className="w-5 h-5 shrink-0" /><span className="truncate">{t("contract")}</span>
                                </Link>;
                            }
                            if (childId === "document") {
                                return <Link key={childId} to="/all-stations-legal?tab=document" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-legal" && location.search.includes("tab=document") ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                    <FileText className="w-5 h-5 shrink-0" /><span className="truncate">{t("document")}</span>
                                </Link>;
                            }
                            return <Link key={childId} to="/all-stations-reports" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-reports" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                <FileText className="w-5 h-5 shrink-0" /><span className="truncate">{t("reports")}</span>
                            </Link>;
                        })}
                    </div>
                )}
            </div>
        );
    }

    if (slotId === "recentActivities" || slotId === "analytics" || slotId === "stations" || slotId === "reports" || slotId === "requests" || slotId === "tasks" || slotId === "underReview") {
        return null;
    }

    if (slotId === "systemSettings") {
        if (isDeptUser || (!showSystemUsers && !showSystemSettings)) {
            return null;
        }
        return (
            <div ref={systemSettingsWrapRef} className={sidebarOpen ? "space-y-1" : "relative z-[55]"}>
                    <button
                        type="button"
                        onClick={() => setSystemSettingsOpen((open) => !open)}
                        className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-4" : "justify-center px-2"} py-3 rounded-lg transition-all duration-200 ${sidebarOpen
                            ? systemSettingsOpen || isSystemSettingsRoute
                                ? "bg-white/15 text-white shadow-md"
                                : "text-white/80 hover:bg-white/15 hover:text-white"
                            : systemSettingsOpen || isSystemSettingsRoute
                                ? "bg-white/15 text-white"
                                : "text-white/80 hover:bg-white/15 hover:text-white"
                            }`}
                        title={!sidebarOpen ? t("systemSetting") : undefined}
                        aria-expanded={systemSettingsOpen}
                    >
                        <Settings className="w-5 h-5 shrink-0" />
                        {sidebarOpen && (
                            <>
                                <span className="flex-1 min-w-0 text-start text-sm font-semibold truncate">
                                    {t("systemSetting")}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 shrink-0 text-white/90 transition-transform duration-200 ${systemSettingsOpen ? "rotate-180" : ""
                                        }`}
                                    aria-hidden
                                />
                            </>
                        )}
                    </button>
                    {sidebarOpen && systemSettingsOpen && (
                        <div className="ms-2 border-s border-white/25 ps-3 space-y-1 pb-1">
                            {sidebarNestedOrder.systemSettings.map((childId) => {
                                if (childId === "users") {
                                    if (!showSystemUsers) return null;
                                    return (
                                        <Link key={childId} to="/all-stations-users" onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                            className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-users" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                            <Users className="w-5 h-5 shrink-0" /><span className="truncate">{t("users")}</span>
                                        </Link>
                                    );
                                }
                                if (childId === "companyInfo") {
                                    if (!showSystemSettings) return null;
                                    return (
                                        <Link key={childId} to="/all-stations-settings" onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                            className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${location.pathname === "/all-stations-settings" ? "bg-primary text-white shadow-lg" : "text-white/90 hover:bg-white/10"}`}>
                                            <Settings className="w-5 h-5 shrink-0" /><span className="truncate">{t("companyInfo")}</span>
                                        </Link>
                                    );
                                }
                                if (childId === "notifications") {
                                    return <div key={childId} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-white/65"><Bell className="w-5 h-5 shrink-0" /><span className="truncate">{t("notifications")}</span></div>;
                                }
                                return <div key={childId} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-white/65"><DatabaseBackup className="w-5 h-5 shrink-0" /><span className="truncate">{t("backup")}</span></div>;
                            })}
                        </div>
                    )}
            </div>
        );
    }

    const item = navigation.find((n) => n.titleKey === slotId);
    if (!item) return null;

    return (
        <Link
            to={item.path}
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className={`flex items-center ${sidebarOpen ? "gap-3 px-4" : "justify-center px-2"} py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path
                ? "bg-primary text-white shadow-lg"
                : "text-white/80 hover:bg-white/15 hover:text-white"
                } relative`}
            title={!sidebarOpen ? t(item.titleKey) : undefined}
        >
            {item.icon}
            {sidebarOpen && (
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium truncate">{t(item.titleKey)}</span>
                    {item.titleKey === "tasks" && taskCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 bg-info text-info-foreground rounded-full flex items-center justify-center text-[10px] font-bold leading-none shadow-sm">
                            {taskCount > 99 ? "99+" : taskCount}
                        </span>
                    )}
                    {item.titleKey === "underReview" && underReviewCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 bg-info text-info-foreground rounded-full flex items-center justify-center text-[10px] font-bold leading-none shadow-sm">
                            {underReviewCount > 99 ? "99+" : underReviewCount}
                        </span>
                    )}
                </div>
            )}
        </Link>
    );
}
