import { useState } from "react";
import { Save, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStation } from "../../context/StationContext";

export function StationTypeForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';
  const navigate = useNavigate();

  const [types, setTypes] = useState([
    { code: "1", description: "Owned Station" },
    { code: "2", description: "Rented Station" },
    { code: "3", description: "Operation" },
    { code: "4", description: "Franchise" },
  ]);

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Station Type (Master Data)</h1>
          <p className="text-gray-600 mt-2">Manage station type classifications</p>
        </div>

        {isReadOnly && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-semibold">View Only Mode</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-xl p-8 vibrant-glow border-t-4 border-violet-600 relative overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Station Type Code (PK)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr
                key={type.code}
                onClick={() => navigate("/total-stations")}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                title={`View all ${type.description}s`}
              >
                <td className="py-3 px-4">{type.code}</td>
                <td className="py-3 px-4">{type.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}







