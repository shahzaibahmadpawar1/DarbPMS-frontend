import { useState } from "react";
import { X, Send, User, ChevronDown, Minimize2 } from "lucide-react";

interface Message {
    id: number;
    sender: string;
    role: string;
    content: string;
    timestamp: string;
    isCurrentUser: boolean;
}

interface ChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

const roles = [
    { id: "land-owner", name: "Land Owner", color: "bg-green-500", online: true },
    { id: "project-manager", name: "Project Manager", color: "bg-blue-500", online: true },
    { id: "engineer", name: "Engineer", color: "bg-orange-500", online: false },
    { id: "contractor", name: "Contractor", color: "bg-orange-500", online: true },
    { id: "admin", name: "Admin", color: "bg-red-500", online: true },
];

const demoMessages: Message[] = [
    {
        id: 1,
        sender: "Ahmed Al-Rashid",
        role: "Project Manager",
        content: "The building permit has been approved. We can proceed with the next phase.",
        timestamp: "10:30 AM",
        isCurrentUser: false,
    },
    {
        id: 2,
        sender: "You",
        role: "Land Owner",
        content: "Great! When can we start the construction?",
        timestamp: "10:32 AM",
        isCurrentUser: true,
    },
    {
        id: 3,
        sender: "Ahmed Al-Rashid",
        role: "Project Manager",
        content: "We're targeting next Monday. I'll send you the detailed timeline by EOD.",
        timestamp: "10:35 AM",
        isCurrentUser: false,
    },
];

export function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [selectedRole, setSelectedRole] = useState(roles[1]); // Default to Project Manager
    const [messages, setMessages] = useState<Message[]>(demoMessages);
    const [newMessage, setNewMessage] = useState("");
    const [showRoleSelector, setShowRoleSelector] = useState(false);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message: Message = {
                id: messages.length + 1,
                sender: "You",
                role: "Land Owner",
                content: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isCurrentUser: true,
            };
            setMessages([...messages, message]);
            setNewMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
                }`}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-gray-500 rounded-t-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                        <div className={`w-10 h-10 ${selectedRole.color} rounded-full flex items-center justify-center`}>
                            <User className="w-5 h-5 text-white" />
                        </div>
                        {selectedRole.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                        )}
                    </div>
                    <div className="flex-1">
                        <button
                            onClick={() => setShowRoleSelector(!showRoleSelector)}
                            className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-colors"
                        >
                            <h3 className="text-white font-bold text-sm">{selectedRole.name}</h3>
                            <ChevronDown className="w-4 h-4 text-white" />
                        </button>
                        <p className="text-white/80 text-xs">
                            {selectedRole.online ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Minimize"
                    >
                        <Minimize2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Close chat"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>

            {/* Role Selector Dropdown */}
            {showRoleSelector && !isMinimized && (
                <div className="absolute top-20 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-200 z-10 max-h-64 overflow-y-auto">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => {
                                setSelectedRole(role);
                                setShowRoleSelector(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            <div className="relative">
                                <div className={`w-10 h-10 ${role.color} rounded-full flex items-center justify-center`}>
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                {role.online && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-semibold text-gray-900 text-sm">{role.name}</p>
                                <p className="text-xs text-gray-500">{role.online ? "Online" : "Offline"}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] ${message.isCurrentUser
                                            ? 'bg-gradient-to-r from-orange-600 to-gray-500 text-white'
                                            : 'bg-white border border-gray-200 text-gray-900'
                                        } rounded-2xl p-3 shadow-sm`}
                                >
                                    {!message.isCurrentUser && (
                                        <p className="text-xs font-semibold mb-1 text-orange-600">
                                            {message.sender} • {message.role}
                                        </p>
                                    )}
                                    <p className="text-sm">{message.content}</p>
                                    <p
                                        className={`text-xs mt-1 ${message.isCurrentUser ? 'text-white/70' : 'text-gray-500'
                                            }`}
                                    >
                                        {message.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 rounded-b-2xl">
                        <div className="flex items-end gap-2">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent max-h-24"
                                rows={1}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className="w-10 h-10 bg-gradient-to-r from-orange-600 to-gray-500 rounded-xl flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                <Send className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
