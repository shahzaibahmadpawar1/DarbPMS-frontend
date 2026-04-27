import { Search, MoreVertical, FileText, Download, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";

interface FormRecordsListProps {
    title: string;
    columns: string[];
    records: any[];
}

export function FormRecordsList({ title, columns, records }: FormRecordsListProps) {
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

    const normalizedColumns = useMemo(
        () => columns.map((c) => ({ raw: c, key: c.toLowerCase().replace(/[^a-z0-9]/g, "") })),
        [columns],
    );

    const getCellValue = (record: any, column: string, index: number): unknown => {
        if (record && Object.prototype.hasOwnProperty.call(record, column)) {
            return record[column];
        }

        const targetKey = column.toLowerCase().replace(/[^a-z0-9]/g, "");
        const match = Object.keys(record || {}).find(
            (key) => key.toLowerCase().replace(/[^a-z0-9]/g, "") === targetKey,
        );

        if (match) {
            return record[match];
        }

        return Object.values(record || {})[index] ?? "-";
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={`Search ${title.toLowerCase()} records...`}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-primary"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                {columns.map((col, idx) => (
                                    <th key={idx} className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        {col}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {records.map((record, rIdx) => (
                                <tr key={rIdx} className="hover:bg-muted/40 transition-colors group">
                                    {normalizedColumns.map((column, vIdx) => {
                                        const val = getCellValue(record, column.raw, vIdx);
                                        return (
                                        <td key={vIdx} className="px-6 py-4">
                                            {vIdx === 0 ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded text-primary">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold text-foreground">{String(val ?? "-")}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground font-medium">{String(val ?? "-")}</span>
                                            )}
                                        </td>
                                    )})}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRecord(record)}
                                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                                                title="Open full details"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-muted-foreground hover:text-foreground">
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

            {selectedRecord && (
                <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-bold text-foreground">Full Record Details</h3>
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded-lg border border-border text-sm"
                                onClick={() => setSelectedRecord(null)}
                            >
                                Close
                            </button>
                        </div>
                        <div className="p-5 overflow-auto max-h-[65vh] space-y-3">
                            {Object.entries(selectedRecord).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-2 border border-border rounded-lg p-3">
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{key}</p>
                                    <p className="text-sm text-foreground md:col-span-2 break-all">{String(value ?? "-")}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}






