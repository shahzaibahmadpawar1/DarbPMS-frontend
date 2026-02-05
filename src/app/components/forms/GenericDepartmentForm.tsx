import { useState } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

interface GenericFormProps {
    title: string;
    description: string;
    fields: { name: string; label: string; type: string; required?: boolean; demoValue?: string }[];
}

export function GenericDepartmentForm({ title, description, fields }: GenericFormProps) {
    const { accessMode } = useStation();
    const isReadOnly = accessMode === 'view-only';

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');

    // Pre-fill with demo data in single station mode
    const [formData, setFormData] = useState<Record<string, string>>(
        fields.reduce((acc, field) => ({
            ...acc,
            [field.name]: isReadOnly && field.demoValue ? field.demoValue : ""
        }), {})
    );

    const mockRecords = [
        { id: "001", name: "Sample Record 1", status: "Active" },
        { id: "002", name: "Sample Record 2", status: "Pending" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`${title}:`, formData);
        alert(`${title} record saved successfully!`);
    };

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                    <p className="text-muted-foreground mt-2">
                        {isReadOnly ? `View ${description.toLowerCase()}` : description}
                    </p>
                </div>

                {!isReadOnly && (
                    <div className="flex bg-muted p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setViewMode('form')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                                ? 'bg-card text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>New Entry</span>
                        </button>
                        <button
                            onClick={() => setViewMode('records')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                                ? 'bg-card text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            <span>View Records</span>
                        </button>
                    </div>
                )}

                {isReadOnly && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-semibold">View Only Mode</span>
                    </div>
                )}
            </div>

            {viewMode === 'form' ? (
                <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                            {title} Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map((field) => (
                                <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                        {field.label} {field.required && <span className="text-error">*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={formData[field.name]}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                            rows={3}
                                            required={field.required}
                                            disabled={isReadOnly}
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            value={formData[field.name]}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                            required={field.required}
                                            disabled={isReadOnly}
                                        >
                                            <option value="">Select {field.label}</option>
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={formData[field.name]}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                            required={field.required}
                                            disabled={isReadOnly}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {!isReadOnly && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Save className="w-5 h-5" />
                                Save {title}
                            </button>
                        </div>
                    )}
                </form>
            ) : (
                <FormRecordsList
                    title={`${title} Records`}
                    columns={["ID", "Name", "Status"]}
                    records={mockRecords}
                />
            )}
        </div>
    );
}
