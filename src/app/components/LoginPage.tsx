import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BrandName } from "./BrandName";
import logo from "../../assets/logo.png";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate a brief loading state for better UX
        setTimeout(() => {
            navigate("/mode-selection");
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-gray-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Language Switcher - Top Right */}
            <div className="absolute top-6 right-6 z-20">
                <LanguageSwitcher />
            </div>

            {/* Animated mesh gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/30 via-transparent to-gray-100/30 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-10 vibrant-glow relative overflow-hidden">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-orange-500 to-gray-500"></div>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl shadow-orange-200 mb-6 group transition-transform hover:scale-110 duration-300 p-2">
                            <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight"><BrandName /> Station</h1>
                        <p className="text-gray-500 font-medium mt-2">Project Management System</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full vibrant-btn py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 group relative overflow-hidden transition-all disabled:opacity-70"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-500">
                            Powered by <span className="font-bold text-orange-600">Nocastra</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
