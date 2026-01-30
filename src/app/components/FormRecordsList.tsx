import { Search, MoreVertical, FileText, Download, ExternalLink } from "lucide-react";

interface FormRecordsListProps {
    title: string;
    columns: string[];
    records: any[];
}

export function FormRecordsList({ title, columns, records }: FormRecordsListProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search ${title.toLowerCase()} records...`}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6366f1]"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                {columns.map((col, idx) => (
                                    <th key={idx} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {col}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {records.map((record, rIdx) => (
                                <tr key={rIdx} className="hover:bg-gray-50 transition-colors group">
                                    {Object.values(record).map((val: any, vIdx) => (
                                        <td key={vIdx} className="px-6 py-4">
                                            {vIdx === 0 ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-violet-50 rounded text-[#6366f1]">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold text-[#020713]">{val}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-600 font-medium">{val}</span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-[#6366f1] hover:bg-violet-50 rounded-lg">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}





