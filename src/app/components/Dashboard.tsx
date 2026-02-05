import { Clock, AlertCircle, CheckCircle, Calendar } from "lucide-react";
import { BrandName } from "./BrandName";
import { Link } from "react-router-dom";
import { ExecutiveDashboard } from "./ExecutiveDashboard";
import logo from "../../assets/logo.png";

export function Dashboard() {
  const stats = [
    {
      title: "Total Stations",
      value: "156",
      icon: <img src={logo} alt="" className="w-8 h-8 object-contain brightness-0 invert" />,
      change: "+12%",
      color: "bg-gradient-to-br from-primary to-secondary",
      path: "/total-stations",
    },
    {
      title: "Under Process",
      value: "42",
      icon: <Clock className="w-8 h-8" />,
      change: "+5%",
      color: "bg-info",
      path: "/active-licenses",
    },
    {
      title: "Delay",
      value: "8",
      icon: <AlertCircle className="w-8 h-8" />,
      change: "-3%",
      color: "bg-error",
      path: "/pending-permits",
    },
    {
      title: "Completed",
      value: "98",
      icon: <CheckCircle className="w-8 h-8" />,
      change: "+18%",
      color: "bg-success",
      path: "/active-projects",
    },
    {
      title: "Opening Soon",
      value: "8",
      icon: <Calendar className="w-8 h-8" />,
      change: "+2%",
      color: "bg-gradient-to-br from-primary to-secondary",
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
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Dashboard</h1>
        <p className="text-gray-600"><BrandName /> Project Management & Tracking System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.path}
            className="bg-card rounded-xl shadow-md p-6 card-glow transition-all block group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} text-white p-3 rounded-xl shadow-lg shadow-primary/20`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-success' : 'text-error'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Total Stations Progress Widget */}
      <div className="bg-card rounded-xl shadow-xl p-8 mb-8 card-glow relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Total Stations Progress</h2>
          <Link to="/total-stations" className="text-primary text-sm font-semibold hover:underline">View All</Link>
        </div>
        <div className="space-y-6">
          {stations.map((station, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">{station.name}</p>
                  <span className="text-xs text-muted-foreground">{station.status}</span>
                </div>
                <span className="text-sm font-bold text-primary">{station.completion}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full progress-bar transition-all duration-500"
                  style={{ width: `${station.completion}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-card rounded-xl shadow-xl p-8 mb-12 card-glow relative overflow-hidden">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all bg-card/50 backdrop-blur-sm"
            >
              <div>
                <p className="font-medium text-foreground">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.station}</p>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Analytics Section */}
      <div className="mt-8 border-t border-border pt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 px-4">Executive Analytics</h2>
        <ExecutiveDashboard />
      </div>
    </div>
  );
}





