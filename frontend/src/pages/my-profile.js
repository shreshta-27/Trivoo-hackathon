import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { auth } from '../utils/api';
import {
    User,
    Mail,
    Lock,
    Briefcase,
    Save,
    Eye,
    EyeOff,
    Loader,
    Check
} from 'lucide-react';

export default function MyProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profession: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await auth.getProfile();
            if (res.data?.data) {
                const user = res.data.data;
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    password: '', // Don't populate password
                    profession: user.profession || '',
                });
                // Also update localStorage if needed
                localStorage.setItem('userInfo', JSON.stringify(user));
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            // Fallback to local storage if API fails (e.g. offline)
            const stored = localStorage.getItem('userInfo');
            if (stored) {
                const user = JSON.parse(stored);
                setFormData(prev => ({
                    ...prev,
                    name: user.name || '',
                    email: user.email || '',
                    profession: user.profession || ''
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage(null);

            const payload = {
                name: formData.name,
                email: formData.email,
                profession: formData.profession
            };
            if (formData.password) {
                payload.password = formData.password;
            }

            const res = await auth.updateProfile(payload);
            if (res.data?.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false);
                // Update local storage
                if (res.data.data) {
                    localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                }
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <DashboardLayout activePage="profile">
                <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
                    />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activePage="profile">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    className="flex items-center gap-4 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            My Profile
                        </h1>
                        <p className="text-gray-400">
                            Manage your personal information
                        </p>
                    </div>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    className="glass-card max-w-2xl mx-auto p-8 md:p-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {/* Message Toast */}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}
                        >
                            {message.type === 'success' ? <Check className="w-5 h-5" /> : <Loader className="w-5 h-5" />}
                            {message.text}
                        </motion.div>
                    )}

                    {/* Profile Avatar */}
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-emerald-500/30">
                            {formData.name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-emerald-500 mb-2">
                                <User className="w-4 h-4" />
                                Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3.5 rounded-xl text-white transition-all
                                    ${isEditing
                                        ? 'bg-white/5 border border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                        : 'bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed'
                                    }`}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-emerald-500 mb-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3.5 rounded-xl text-white transition-all
                                    ${isEditing
                                        ? 'bg-white/5 border border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                        : 'bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed'
                                    }`}
                            />
                        </div>

                        {/* Password Field */}
                        {isEditing && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <label className="flex items-center gap-2 text-sm font-medium text-emerald-500 mb-2">
                                    <Lock className="w-4 h-4" />
                                    New Password (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        placeholder="Leave blank to keep current"
                                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-emerald-500 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Profession Field */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-emerald-500 mb-2">
                                <Briefcase className="w-4 h-4" />
                                Profession
                            </label>
                            <input
                                type="text"
                                value={formData.profession}
                                onChange={(e) => handleChange('profession', e.target.value)}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3.5 rounded-xl text-white transition-all
                                    ${isEditing
                                        ? 'bg-white/5 border border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                        : 'bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        {!isEditing ? (
                            <motion.button
                                onClick={() => setIsEditing(true)}
                                className="w-full py-4 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Edit Profile
                            </motion.button>
                        ) : (
                            <>
                                <motion.button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {saving ? (
                                        <Loader className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                                <motion.button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData(prev => ({ ...prev, password: '' })); // Clear password on cancel
                                        fetchProfile(); // Reset fields to saved values
                                    }}
                                    disabled={saving}
                                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
