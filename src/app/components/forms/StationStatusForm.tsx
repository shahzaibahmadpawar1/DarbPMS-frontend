import { useState } from "react";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function StationStatusForm() {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState([
    { code: "1", description: "Active" },
    { code: "2", description: "Inactive" },
    { code: "3", description: "Under Construction" },
    { code: "4", description: "Under Development" },
  ]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#020713]">Station Status (Master Data)</h1>
        <p className="text-gray-600 mt-2">Manage station status classifications</p>
      </div>

      <div className="bg-white rounded-xl shadow-xl p-8 vibrant-glow border-t-4 border-violet-600 relative overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status Code (PK)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((status) => (
              <tr
                key={status.code}
                onClick={() => navigate("/total-stations")}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                title={`View all ${status.description} stations`}
              >
                <td className="py-3 px-4">{status.code}</td>
                <td className="py-3 px-4">{status.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}






