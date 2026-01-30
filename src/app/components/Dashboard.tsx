import { Building2, FileCheck, Clock, Activity } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ExecutiveDashboard } from "./ExecutiveDashboard";

export function Dashboard() {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Stations",
      value: "156",
      icon: <Building2 className="w-8 h-8" />,
      change: "+12%",
      color: "bg-[#6366f1]",
      path: "/total-stations",
    },
    {
      title: "Active Licenses",
      value: "142",
      icon: <FileCheck className="w-8 h-8" />,
      change: "+8%",
      color: "bg-[#6366f1]",
      path: "/active-licenses",
    },
    {
      title: "Pending Permits",
      value: "23",
      icon: <Clock className="w-8 h-8" />,
      change: "-5%",
      color: "bg-violet-500",
      path: "/pending-permits",
    },
    {
      title: "Active Projects",
      value: "38",
      icon: <Activity className="w-8 h-8" />,
      change: "+15%",
      color: "bg-[#6366f1]",
      path: "/active-projects",
    },
  ];

  const stations = [
    { name: "Darb Al Sultan Station", completion: 85, status: "In Progress" },
    { name: "Jeddah Central Hub", completion: 45, status: "Early Stage" },
    { name: "Dammam East Point", completion: 100, status: "Completed" },
    { name: "Medina Oasis Station", completion: 15, status: "Planning" },
  ];

  const recentActivities = [
    { action: "New station registered", station: "Station #157", time: "2 hours ago" },
    { action: "Commercial License approved", station: "Station #142", time: "4 hours ago" },
    { action: "Building Permit pending", station: "Station #151", time: "6 hours ago" },
    { action: "Environmental License renewed", station: "Station #089", time: "1 day ago" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#020713] mb-2">Dashboard</h1>
        <p className="text-gray-600">DARB Project Management & Tracking System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.path}
            className="bg-white rounded-xl shadow-md p-6 vibrant-glow-hover vibrant-glow transition-all block group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} text-white p-3 rounded-xl shadow-lg shadow-violet-200`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-[#020713]">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Total Stations Progress Widget */}
      <div className="bg-white rounded-xl shadow-xl p-8 mb-8 vibrant-glow relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#020713]">Total Stations Progress</h2>
          <Link to="/total-stations" className="text-[#6366f1] text-sm font-semibold hover:underline">View All</Link>
        </div>
        <div className="space-y-6">
          {stations.map((station, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#020713]">{station.name}</p>
                  <span className="text-xs text-gray-500">{station.status}</span>
                </div>
                <span className="text-sm font-bold text-[#6366f1]">{station.completion}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${station.completion}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-xl p-8 mb-12 vibrant-glow relative overflow-hidden">
        <h2 className="text-xl font-bold text-[#020713] mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-violet-400 hover:shadow-lg hover:shadow-violet-100 transition-all bg-white/50 backdrop-blur-sm"
            >
              <div>
                <p className="font-medium text-[#020713]">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.station}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Analytics Section */}
      <div className="mt-8 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-[#020713] mb-6 px-4">Executive Analytics</h2>
        <ExecutiveDashboard />
      </div>
    </div>
  );
}





