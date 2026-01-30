import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
    ComposedChart,
} from "recharts";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

// Progress Gauge Component
function CircularProgressGauge({
    percentage,
    label,
    previousMonth,
    size = 140,
}: {
    percentage: number;
    label: string;
    previousMonth: number;
    size?: number;
}) {
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const change = percentage - previousMonth;
    const isPositive = change >= 0;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90" width={size} height={size}>
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress circle with gradient */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={
                            percentage < 30
                                ? "#ef4444"
                                : percentage < 70
                                    ? "#f59e0b"
                                    : "#10b981"
                        }
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{percentage.toFixed(1)}%</div>
                    </div>
                </div>
            </div>
            <div className="mt-3 text-center">
                <div className="text-sm font-semibold text-gray-700">{label}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">Prev Mth:</span>
                    <span className={`text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                        {previousMonth.toFixed(1)}%
                    </span>
                </div>
            </div>
        </div>
    );
}

// Speedometer Gauge Component
function SpeedometerGauge({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
    const percentage = (value / max) * 100;
    const angle = (percentage / 100) * 180 - 90;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: 140, height: 80 }}>
                <svg className="w-full h-full" viewBox="0 0 140 80">
                    {/* Arc background */}
                    <path
                        d="M 20 70 A 50 50 0 0 1 120 70"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                    />
                    {/* Arc gradient fill */}
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 20 70 A 50 50 0 0 1 120 70"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(percentage / 100) * 157} 157`}
                    />
                    {/* Needle */}
                    <line
                        x1="70"
                        y1="70"
                        x2="70"
                        y2="30"
                        stroke="#020713"
                        strokeWidth="2"
                        transform={`rotate(${angle} 70 70)`}
                    />
                    <circle cx="70" cy="70" r="4" fill="#020713" />
                </svg>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                    <div className="text-xl font-bold text-gray-800">{value}%</div>
                </div>
            </div>
            <div className="text-sm font-semibold text-gray-700 mt-2">{label}</div>
        </div>
    );
}

export function ExecutiveDashboard() {
    // Progress data for different phases
    const phaseProgress = [
        { label: "Project Progress", percentage: 55, previousMonth: 48 },
        { label: "Planning", percentage: 85.4, previousMonth: 79.5 },
        { label: "Design", percentage: 68.0, previousMonth: 61.8 },
        { label: "Development", percentage: 55.0, previousMonth: 50.0 },
        { label: "Testing", percentage: 11.0, previousMonth: 10.4 },
    ];

    // Task tracking data for donut chart
    const taskData = [
        { name: "Complete", value: 45, color: "#10b981" },
        { name: "In Progress", value: 30, color: "#3b82f6" },
        { name: "Pending", value: 15, color: "#f59e0b" },
        { name: "Blocked", value: 10, color: "#ef4444" },
    ];

    // Monthly project spend data
    const monthlySpend = [
        { month: "Jul", planned: 2.8, actual: 2.5 },
        { month: "Aug", planned: 3.2, actual: 3.0 },
        { month: "Sep", planned: 2.9, actual: 3.2 },
        { month: "Oct", planned: 3.5, actual: 3.1 },
        { month: "Nov", planned: 3.1, actual: 2.9 },
        { month: "Dec", planned: 3.8, actual: 3.4 },
        { month: "Jan", planned: 3.3, actual: 3.6 },
        { month: "Feb", planned: 3.6, actual: 3.3 },
        { month: "Mar", planned: 3.2, actual: 3.5 },
    ];

    // Average days per task by department
    const taskDaysData = [
        { department: "Planning", days: 4.43 },
        { department: "Design", days: 3.52 },
        { department: "Marketing", days: 4.58 },
        { department: "UX Testing", days: 4.26 },
        { department: "UI & Graphics", days: 3.90 },
        { department: "Backend", days: 4.19 },
        { department: "Frontend", days: 3.90 },
    ];

    // S-Curve data
    const sCurveData = [
        { month: "Month 1", planned: 5, actual: 4 },
        { month: "Month 2", planned: 15, actual: 12 },
        { month: "Month 3", planned: 30, actual: 28 },
        { month: "Month 4", planned: 50, actual: 45 },
        { month: "Month 5", planned: 70, actual: 62 },
        { month: "Month 6", planned: 85, actual: 75 },
        { month: "Month 7", planned: 95, actual: 88 },
        { month: "Month 8", planned: 100, actual: 95 },
    ];

    // Regional expenses
    // const regionalData = [
    //   { region: "North America", amount: 14.2, color: "#3b82f6" },
    //   { region: "South America", amount: 9.1, color: "#10b981" },
    //   { region: "Europe", amount: 2.5, color: "#8b5cf6" },
    //   { region: "Asia Pacific", amount: 5.8, color: "#f59e0b" },
    //   { region: "Middle East", amount: 11.8, color: "#ef4444" },
    //   { region: "Africa", amount: 8.0, color: "#06b6d4" },
    // ];

    // Budget spent data
    const budgetData = [
        { task: "Task 1", spent: 83 },
        { task: "Task 2", spent: 75 },
        { task: "Task 3", spent: 63 },
        { task: "Task 4", spent: 47 },
        { task: "Task 5", spent: 29 },
    ];

    // Key risks
    const keyRisks = [
        {
            icon: "🔴",
            message: "Key users for acceptance testing not assigned. Internal testing only.",
            severity: "high",
        },
        {
            icon: "🟡",
            message: "Project dependencies have shifted. Budget analysis in progress.",
            severity: "medium",
        },
        {
            icon: "🟡",
            message: "Staff availability for project work trending downwards as shown below.",
            severity: "medium",
        },
    ];

    // Manpower planning
    const manpowerData = {
        civil: [
            { category: "Site Engineer", count: 8 },
            { category: "Supervisor", count: 5 },
            { category: "Foreman", count: 12 },
            { category: "Labor", count: 45 },
        ],
        mechanical: [
            { category: "Mechanical Engineer", count: 6 },
            { category: "Technician", count: 10 },
            { category: "Welder", count: 8 },
            { category: "Fitter", count: 15 },
        ],
        electrical: [
            { category: "Electrical Engineer", count: 5 },
            { category: "Electrician", count: 12 },
            { category: "Technician", count: 8 },
            { category: "Helper", count: 10 },
        ],
    };

    // Spend by phase data
    const spendByPhase = [
        { phase: "Phase 1", value: 85, color: "#10b981" },
        { phase: "Phase 2", value: 68, color: "#3b82f6" },
        { phase: "Phase 3", value: 52, color: "#8b5cf6" },
        { phase: "Phase 4", value: 35, color: "#f59e0b" },
        { phase: "Phase 5", value: 20, color: "#ef4444" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-xl shadow-2xl overflow-hidden mt-8">
            <div className="max-w-[1800px] mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Project Progress YTD - March 2026
                    </h1>
                    <p className="text-gray-400">DARB Station Executive Dashboard</p>
                </div>

                {/* Top Section - Circular Progress Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    {phaseProgress.map((phase, index) => (
                        <div
                            key={index}
                            className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl"
                        >
                            <CircularProgressGauge
                                percentage={phase.percentage}
                                label={phase.label}
                                previousMonth={phase.previousMonth}
                            />
                        </div>
                    ))}
                </div>

                {/* Middle Row with Gauges and Days Counter */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="col-span-1 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl">
                        <SpeedometerGauge value={27} label="EAC Margin" />
                    </div>
                    <div className="col-span-1 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold text-[#00C0A7]">256</div>
                        <div className="text-sm text-gray-400 mt-2">Days</div>
                        <div className="text-xs text-gray-500 mt-1">Launch Date</div>
                    </div>
                    <div className="lg:col-span-3"></div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    {/* Left Column - Task Tracking & Monthly Spend */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Task Tracking Donut */}
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">Task Tracking</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={taskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {taskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1e293b",
                                            border: "1px solid #475569",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                {taskData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-sm"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-xs text-gray-400">
                                            {item.name}: {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monthly Project Spend */}
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">
                                Month on Month Project Spend
                            </h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={monthlySpend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#9ca3af"
                                        style={{ fontSize: "10px" }}
                                    />
                                    <YAxis stroke="#9ca3af" style={{ fontSize: "10px" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1e293b",
                                            border: "1px solid #475569",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{ fontSize: "10px" }}
                                        iconType="line"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="planned"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        name="Planned"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="actual"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        name="Actual"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Center Column - Bar Charts */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Average Days per Task */}
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">
                                Average Days per Task by Department
                            </h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={taskDaysData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis
                                        dataKey="department"
                                        stroke="#9ca3af"
                                        style={{ fontSize: "10px" }}
                                        angle={-15}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis stroke="#9ca3af" style={{ fontSize: "10px" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1e293b",
                                            border: "1px solid #475569",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                    />
                                    <Bar dataKey="days" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* S-Curve Progress Tracking */}
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">
                                S-Curve Progress Tracking
                            </h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <ComposedChart data={sCurveData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#9ca3af"
                                        style={{ fontSize: "10px" }}
                                    />
                                    <YAxis stroke="#9ca3af" style={{ fontSize: "10px" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1e293b",
                                            border: "1px solid #475569",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{ fontSize: "10px" }}
                                        iconType="line"
                                    />
                                    <Bar
                                        dataKey="planned"
                                        fill="#6366f1"
                                        radius={[4, 4, 0, 0]}
                                        name="Planned"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="actual"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        name="Actual"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Column - Regional Expenses & Spend by Phase */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Regional Expenses Map */}
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">
                                Regional Expense Actuals
                            </h3>
                            <div className="relative h-[200px]">
                                {/* Simplified world map representation */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-full h-full">
                                        {/* Map placeholder with data points */}
                                        <svg className="w-full h-full" viewBox="0 0 400 200">
                                            {/* Simplified continents */}
                                            <path
                                                d="M50,80 Q70,70 90,75 L110,85 L100,100 L80,95 Z"
                                                fill="#475569"
                                                opacity="0.6"
                                            />
                                            <path
                                                d="M60,110 L80,105 L90,120 L70,130 Z"
                                                fill="#475569"
                                                opacity="0.6"
                                            />
                                            <path
                                                d="M120,60 Q180,50 220,65 L240,80 L230,100 L200,95 L180,85 Z"
                                                fill="#475569"
                                                opacity="0.6"
                                            />
                                            <path
                                                d="M250,70 Q280,65 310,75 L330,90 L320,110 L290,105 Z"
                                                fill="#475569"
                                                opacity="0.6"
                                            />
                                            <path
                                                d="M200,110 L220,105 L230,120 L210,130 Z"
                                                fill="#475569"
                                                opacity="0.6"
                                            />
                                            <path
                                                d="M340,100 Q360,95 375,105 L370,125 L355,120 Z"
                                                fill="#475569"
                                                opacity="0.6"
                                            />

                                            {/* Data points */}
                                            <circle cx="80" cy="85" r="6" fill="#3b82f6" />
                                            <text x="80" y="75" textAnchor="middle" fill="#fff" fontSize="10">
                                                $14.2m
                                            </text>

                                            <circle cx="75" cy="120" r="5" fill="#10b981" />
                                            <text x="75" y="145" textAnchor="middle" fill="#fff" fontSize="10">
                                                $9.1m
                                            </text>

                                            <circle cx="180" cy="75" r="4" fill="#8b5cf6" />
                                            <text x="180" y="65" textAnchor="middle" fill="#fff" fontSize="10">
                                                $2.5m
                                            </text>

                                            <circle cx="300" cy="85" r="5" fill="#f59e0b" />
                                            <text x="300" y="75" textAnchor="middle" fill="#fff" fontSize="10">
                                                $5.8m
                                            </text>

                                            <circle cx="220" cy="95" r="6" fill="#ef4444" />
                                            <text x="220" y="85" textAnchor="middle" fill="#fff" fontSize="10">
                                                $11.8m
                                            </text>

                                            <circle cx="215" cy="120" r="5" fill="#06b6d4" />
                                            <text x="215" y="140" textAnchor="middle" fill="#fff" fontSize="10">
                                                $8.0m
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Spend by Phase Donut */}
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">
                                Overhead Construction Events
                            </h3>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={spendByPhase}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={70}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {spendByPhase.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1e293b",
                                            border: "1px solid #475569",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Budget Spent */}
                    <div className="lg:col-span-3 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl">
                        <h3 className="text-sm font-semibold text-gray-300 mb-4">
                            Project Budget Spent to Date
                        </h3>
                        <div className="space-y-3">
                            {budgetData.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-gray-400">{item.task}</span>
                                        <span className="text-xs font-semibold text-gray-300">
                                            {item.spent}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-600 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${item.spent}%`,
                                                backgroundColor:
                                                    item.spent > 70
                                                        ? "#10b981"
                                                        : item.spent > 40
                                                            ? "#3b82f6"
                                                            : "#60a5fa",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Risks */}
                    <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl">
                        <h3 className="text-sm font-semibold text-gray-300 mb-4">
                            Key Risks to Project
                        </h3>
                        <div className="space-y-3">
                            {keyRisks.map((risk, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {risk.severity === "high" ? (
                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                        ) : (
                                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        {risk.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* S-Curve Risk Indicator */}
                        <div className="mt-4">
                            <ResponsiveContainer width="100%" height={80}>
                                <AreaChart data={sCurveData}>
                                    <defs>
                                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="actual"
                                        stroke="#10b981"
                                        fill="url(#colorRisk)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Manpower Planning */}
                    <div className="lg:col-span-4 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl">
                        <h3 className="text-sm font-semibold text-gray-300 mb-4">
                            Manpower Planning
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Civil */}
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <div className="text-xs font-semibold text-[#10b981] mb-3">Civil</div>
                                <div className="space-y-2">
                                    {manpowerData.civil.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-400">{item.category}</span>
                                            <span className="text-xs font-semibold text-gray-300">
                                                {item.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mechanical */}
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <div className="text-xs font-semibold text-[#3b82f6] mb-3">
                                    Mechanical
                                </div>
                                <div className="space-y-2">
                                    {manpowerData.mechanical.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-400">{item.category}</span>
                                            <span className="text-xs font-semibold text-gray-300">
                                                {item.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Electrical */}
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <div className="text-xs font-semibold text-[#f59e0b] mb-3">
                                    Electrical
                                </div>
                                <div className="space-y-2">
                                    {manpowerData.electrical.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-400">{item.category}</span>
                                            <span className="text-xs font-semibold text-gray-300">
                                                {item.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
