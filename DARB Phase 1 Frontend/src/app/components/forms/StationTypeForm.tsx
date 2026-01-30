import { useState } from "react";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function StationTypeForm() {
  const navigate = useNavigate();
  const [types, setTypes] = useState([
    { code: "1", description: "Owned Station" },
    { code: "2", description: "Rented Station" },
    { code: "3", description: "Operation" },
    { code: "4", description: "Franchise" },
  ]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#020713]">Station Type (Master Data)</h1>
        <p className="text-gray-600 mt-2">Manage station type classifications</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
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
