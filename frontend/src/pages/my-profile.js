import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import {
    User,
    Mail,
    Lock,
    Briefcase,
    Save,
    Eye,
    EyeOff,
} from 'lucide-react';

export default function MyProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [name, setName] = useState('User');
    const [email, setEmail] = useState('user@trivo.io');
    const [password, setPassword] = useState('********');
    const [profession, setProfession] = useState('Environmental Scientist');

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save to backend
    };

    return (
        <DashboardLayout activePage="profile">
            <div style={{
                height: 'calc(100vh - 60px)',
                overflow: 'auto',
                padding: '2rem',
            }}>
                {/* Header */}
                <motion.div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                    }}>
                        <User style={{ width: '28px', height: '28px', color: '#ffffff' }} />
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            marginBottom: '0.25rem',
                        }}>
                            My Profile
                        </h1>
                        <p style={{
                            fontSize: '1rem',
                            color: 'var(--text-secondary)',
                        }}>
                            Manage your personal information
                        </p>
                    </div>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    className="glass-card"
                    style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        padding: '2.5rem',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {/* Profile Avatar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                    }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#ffffff',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                        }}>
                            {name.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Name Field */}
                        <div>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9375rem',
                                color: 'var(--emerald-green)',
                                marginBottom: '0.75rem',
                                fontWeight: '500',
                            }}>
                                <User style={{ width: '16px', height: '16px' }} />
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isEditing}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: isEditing ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                    border: `1px solid ${isEditing ? 'var(--emerald-green)' : 'var(--glass-border)'}`,
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    cursor: isEditing ? 'text' : 'not-allowed',
                                }}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9375rem',
                                color: 'var(--emerald-green)',
                                marginBottom: '0.75rem',
                                fontWeight: '500',
                            }}>
                                <Mail style={{ width: '16px', height: '16px' }} />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isEditing}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: isEditing ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                    border: `1px solid ${isEditing ? 'var(--emerald-green)' : 'var(--glass-border)'}`,
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    cursor: isEditing ? 'text' : 'not-allowed',
                                }}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9375rem',
                                color: 'var(--emerald-green)',
                                marginBottom: '0.75rem',
                                fontWeight: '500',
                            }}>
                                <Lock style={{ width: '16px', height: '16px' }} />
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={!isEditing}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        paddingRight: '3rem',
                                        background: isEditing ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                        border: `1px solid ${isEditing ? 'var(--emerald-green)' : 'var(--glass-border)'}`,
                                        borderRadius: '10px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        cursor: isEditing ? 'text' : 'not-allowed',
                                    }}
                                />
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '0.875rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            padding: 0,
                                        }}
                                    >
                                        {showPassword ? (
                                            <EyeOff style={{ width: '18px', height: '18px' }} />
                                        ) : (
                                            <Eye style={{ width: '18px', height: '18px' }} />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profession Field */}
                        <div>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9375rem',
                                color: 'var(--emerald-green)',
                                marginBottom: '0.75rem',
                                fontWeight: '500',
                            }}>
                                <Briefcase style={{ width: '16px', height: '16px' }} />
                                Profession
                            </label>
                            <input
                                type="text"
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                disabled={!isEditing}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: isEditing ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                    border: `1px solid ${isEditing ? 'var(--emerald-green)' : 'var(--glass-border)'}`,
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    cursor: isEditing ? 'text' : 'not-allowed',
                                }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '2rem',
                    }}>
                        {!isEditing ? (
                            <motion.button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#ffffff',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: '0 12px 36px rgba(16, 185, 129, 0.6)',
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Edit Profile
                            </motion.button>
                        ) : (
                            <>
                                <motion.button
                                    onClick={handleSave}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#ffffff',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                    }}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: '0 12px 36px rgba(16, 185, 129, 0.6)',
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Save style={{ width: '18px', height: '18px' }} />
                                    Save Changes
                                </motion.button>
                                <motion.button
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        color: 'var(--text-secondary)',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
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
