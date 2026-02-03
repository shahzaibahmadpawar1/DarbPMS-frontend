import { useState } from "react";
import { Save, List, PlusCircle, FileText, Eye, Check, X } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

type RequestType =
    | "product-supply"
    | "purchase-clothes"
    | "quotation-automation"
    | "price-quote-screens"
    | "price-quote-pumps"
    | "price-quote-camera"
    | "quotation-fuel-tanks"
    | "quotation-fuel-extensions";

interface ProcurementFormData {
    requestType: RequestType | "";
    requestNumber: string;
    requestDate: string;
    requester: string;
    department: string;
    priority: string;
    status: string;
    // Product Supply Request fields
    productName?: string;
    productDescription?: string;
    quantity?: string;
    estimatedCost?: string;
    supplier?: string;
    deliveryDate?: string;
    // Purchase Clothes fields
    itemType?: string;
    size?: string;
    color?: string;
    // Quotation fields
    equipmentType?: string;
    specifications?: string;
    preferredBrand?: string;
    budget?: string;
    quotationDeadline?: string;
    notes: string;
}

export function ProcurementDepartmentForm() {
    const { accessMode } = useStation();
    const isReadOnly = accessMode === 'view-only';

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
    const [formData, setFormData] = useState<ProcurementFormData>({
        requestType: isReadOnly ? "product-supply" : "",
        requestNumber: isReadOnly ? "PR-N101-882" : "",
        requestDate: isReadOnly ? "2024-06-10" : "",
        requester: isReadOnly ? "Ali Al-Harbi" : "",
        department: isReadOnly ? "Station Operations" : "",
        priority: isReadOnly ? "high" : "",
        status: isReadOnly ? "approved" : "",
        notes: isReadOnly ? "Urgent procurement of high-flow fuel pumps for Island 3 renovation." : "",
        productName: isReadOnly ? "Wayne High-Flow Pump G3" : "",
        productDescription: isReadOnly ? "Electronic fuel dispenser with 4 hoses and high-speed flow rate." : "",
        quantity: isReadOnly ? "4" : "",
        estimatedCost: isReadOnly ? "120000" : "",
        supplier: isReadOnly ? "Wayne Fueling Solutions KSA" : "",
        deliveryDate: isReadOnly ? "2024-07-05" : "",
    });

    const requestTypes = [
        { value: "product-supply", label: "Product Supply Request" },
        { value: "purchase-clothes", label: "Request to Purchase Clothes" },
        { value: "quotation-automation", label: "Request for Quotation for Automation" },
        { value: "price-quote-screens", label: "Request a Price Quote for Price Screens" },
        { value: "price-quote-pumps", label: "Request a Price Quote for Pumps" },
        { value: "price-quote-camera", label: "Request for a Price Quote for Camera Installation" },
        { value: "quotation-fuel-tanks", label: "Request for Quotation for Fuel Tanks" },
        { value: "quotation-fuel-extensions", label: "Request for Quotation for Fuel Extensions" },
    ];

    const mockRecords = [
        { id: "PR-001", type: "Product Supply Request", requester: "Ahmed Ali", status: "Approved", date: "2024-01-15" },
        { id: "PR-002", type: "Purchase Clothes", requester: "Sara Hassan", status: "Pending", date: "2024-01-20" },
        { id: "PR-003", type: "Quotation for Automation", requester: "Mohammed Khalid", status: "In Review", date: "2024-01-22" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Procurement Request:", formData);
        alert("Procurement request saved successfully!");
    };

    const renderRequestTypeFields = () => {
        switch (formData.requestType) {
            case "product-supply":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                value={formData.productName || ""}
                                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                disabled={isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                value={formData.quantity || ""}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                disabled={isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                            <input
                                type="text"
                                value={formData.supplier || ""}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                disabled={isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (SAR)</label>
                            <input
                                type="number"
                                value={formData.estimatedCost || ""}
                                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                disabled={isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                            <input
                                type="date"
                                value={formData.deliveryDate || ""}
                                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                            <textarea
                                value={formData.productDescription || ""}
                                onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                rows={3}
                                disabled={isReadOnly}
                            />
                        </div>
                    </>
                );

            case "purchase-clothes":
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                            <select
                                value={formData.itemType || ""}
                                onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                disabled={isReadOnly}
                            >
                                <option value="">Select Item Type</option>
                                <option value="uniform">Uniform</option>
                                <option value="safety-gear">Safety Gear</option>
                                <option value="workwear">Workwear</option>
                                <option value="protective-equipment">Protective Equipment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                            <input
                                type="text"
                                value={formData.size || ""}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                placeholder="e.g., S, M, L, XL"
                                disabled={isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <input
                                type="text"
                                value={formData.color || ""}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                disabled={isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                value={formData.quantity || ""}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                disabled={isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (SAR)</label>
                            <input
                                type="number"
                                value={formData.estimatedCost || ""}
                                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                disabled={isReadOnly}
                            />
                        </div>
                    </>
                );

            case "quotation-automation":
            case "price-quote-screens":
            case "price-quote-pumps":
            case "price-quote-camera":
            case "quotation-fuel-tanks":
            case "quotation-fuel-extensions":
                return (
                    <div className="md:col-span-2">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-violet-400 transition-colors">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-violet-600" />
                                </div>
                                {isReadOnly ? (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Quotation Request Files</h3>
                                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-500 rounded-lg">
                                            <FileText className="w-5 h-5" />
                                            View Attached Quotation
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Quotation Request</h3>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Upload your quotation request document or attachment
                                            </p>
                                        </div>
                                        <label className={`cursor-pointer ${isReadOnly ? 'pointer-events-none opacity-50' : ''}`}>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                                multiple
                                                disabled={isReadOnly}
                                            />
                                            <span className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                Choose Files
                                            </span>
                                        </label>
                                    </>
                                )}
                                <p className="text-xs text-gray-400">
                                    {isReadOnly ? "File upload disabled in view-only mode" : "Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)"}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description (Optional)</label>
                            <textarea
                                value={formData.specifications || ""}
                                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                rows={3}
                                placeholder="Add any additional notes or requirements for this quotation request"
                                disabled={isReadOnly}
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="md:col-span-2 text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Please select a request type to continue</p>
                    </div>
                );
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#020713]">Procurement Department</h1>
                    <p className="text-gray-600 mt-2">Manage procurement requests and supplier relations</p>
                </div>

                {!isReadOnly && (
                    <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setViewMode('form')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                                ? 'bg-white text-[#6366f1] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>New Request</span>
                        </button>
                        <button
                            onClick={() => setViewMode('records')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                                ? 'bg-white text-[#6366f1] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            <span>View Records</span>
                        </button>
                    </div>
                )}

                {isReadOnly && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-semibold">View Only Mode</span>
                    </div>
                )}
            </div>

            {viewMode === 'form' ? (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 vibrant-glow border-t-4 border-violet-600 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Request Type Selection */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
                            Request Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Request Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.requestType}
                                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value as RequestType })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                    required
                                    disabled={isReadOnly}
                                >
                                    <option value="">Select Request Type</option>
                                    {requestTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Request Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.requestNumber}
                                    onChange={(e) => setFormData({ ...formData, requestNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                    required
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                                <input
                                    type="date"
                                    value={formData.requestDate}
                                    onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Requester</label>
                                <input
                                    type="text"
                                    value={formData.requester}
                                    onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                    disabled={isReadOnly}
                                >
                                    <option value="">Select Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                    disabled={isReadOnly}
                                >
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in-review">In Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Fields Based on Request Type */}
                    {formData.requestType && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
                                {requestTypes.find(t => t.value === formData.requestType)?.label} Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderRequestTypeFields()}
                            </div>
                        </div>
                    )}

                    {/* Notes Section */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
                            Additional Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100"
                                    rows={4}
                                    placeholder="Add any additional notes or comments"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Request Action</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: 'approved' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${formData.status === 'approved'
                                                ? 'bg-green-50 border-green-500 text-green-700 shadow-md ring-2 ring-green-100'
                                                : 'bg-white border-gray-200 text-gray-500 hover:border-green-200 hover:text-green-600'
                                            } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isReadOnly}
                                    >
                                        <div className={`p-1 rounded-full ${formData.status === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold">Approve</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: 'rejected' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${formData.status === 'rejected'
                                                ? 'bg-red-50 border-red-500 text-red-700 shadow-md ring-2 ring-red-100'
                                                : 'bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-600'
                                            } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isReadOnly}
                                    >
                                        <div className={`p-1 rounded-full ${formData.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>
                                            <X className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold">Reject</span>
                                    </button>
                                </div>
                                {formData.status && (
                                    <div className={`mt-4 p-3 rounded-lg text-sm font-semibold flex items-center gap-2 ${formData.status === 'approved' ? 'bg-green-50 text-green-700' :
                                            formData.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                                        }`}>
                                        <div className={`w-2 h-2 rounded-full ${formData.status === 'approved' ? 'bg-green-500' :
                                                formData.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                                            }`} />
                                        Current Status: <span className="capitalize">{formData.status.replace('-', ' ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {!isReadOnly && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[#6366f1] hover:bg-[#818cf8] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Save className="w-5 h-5" />
                                Save Procurement Request
                            </button>
                        </div>
                    )}
                </form>
            ) : (
                <FormRecordsList
                    title="Procurement Requests"
                    columns={["Request ID", "Type", "Requester", "Status", "Date"]}
                    records={mockRecords}
                />
            )}
        </div>
    );
}
