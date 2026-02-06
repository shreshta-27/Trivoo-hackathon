import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import dynamic from 'next/dynamic';
import {
    Globe,
    Activity,
    Brain,
    Eye,
    Leaf,
    Bell,
    ArrowRight,
    Instagram,
    Linkedin,
    Twitter,
    TreePine,
    Sparkles,
    TrendingUp,
    Zap,
    Shield,
    Users,
    BarChart3,
    Map,
    Lightbulb
} from 'lucide-react';

const RealisticEarth = dynamic(() => import('../components/RealisticEarth'), {
    ssr: false,
    loading: () => <div className="spinner"></div>,
});

const Nature3DScene = dynamic(() => import('../components/Nature3DScene'), {
    ssr: false,
    loading: () => <div className="spinner"></div>,
});

const FloatingLeaves = dynamic(() => import('../components/FloatingLeaves'), {
    ssr: false,
});

const ParticleBackground = dynamic(() => import('../components/ParticleBackground'), {
    ssr: false,
});

const AnimatedStats = dynamic(() => import('../components/AnimatedStats'), {
    ssr: false,
});

const AuthModal = dynamic(() => import('../components/AuthModal'), {
    ssr: false,
});

export default function LandingPage() {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authView, setAuthView] = useState('login');

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    const openAuthModal = (view) => {
        setAuthView(view);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const features = [
        {
            icon: Lightbulb,
            title: 'Recommended Actions',
            description: 'Get AI-powered recommendations prioritized by impact and urgency to improve your project health scores.',
        },
        {
            icon: Zap,
            title: 'Decision Sandbox',
            description: 'Simulate environmental scenarios and predict impacts before taking action with interactive controls.',
        },
        {
            icon: Bell,
            title: 'Incidents & News',
            description: 'Stay informed about environmental incidents, wildfires, deforestation, and climate events affecting your projects.',
        },
        {
            icon: Brain,
            title: 'AI Assistant',
            description: 'Ask questions and get intelligent explanations about your projects, risks, and environmental insights.',
        },
        {
            icon: Activity,
            title: 'Real-time Monitoring',
            description: 'Track project health, soil moisture, vegetation density, and environmental threats in real-time.',
        },
    ];

    const statsData = [
        { icon: TreePine, label: 'Forests Monitored', value: 2100000, suffix: ' ha', description: 'Real-time deforestation tracking', percentage: 75 },
        { icon: Sparkles, label: 'Carbon Offset', value: 1300000000, suffix: ' tCO₂', description: 'Total carbon sequestered', percentage: 82 },
        { icon: TrendingUp, label: 'Temperature Rise', value: 1.2, prefix: '+', suffix: '°C', description: 'Global average increase', percentage: 60 },
        { icon: Leaf, label: 'Species Tracked', value: 156000, suffix: '', description: 'Biodiversity monitoring', percentage: 90 },
    ];

    return (
        <>
            <ParticleBackground />
            <FloatingLeaves />
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--deep-ocean) 0%, var(--midnight-blue) 50%, var(--ocean-blue) 100%)',
                color: 'var(--text-primary)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 2
            }}>
                <nav style={{
                    background: 'var(--glass-dark)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--glass-border)',
                    padding: '1rem 0',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}>
                    <div style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '0 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <motion.div
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => router.push('/landing')}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                            }}>
                                <Leaf style={{ width: '22px', height: '22px', color: '#ffffff' }} />
                            </div>
                            <span style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                letterSpacing: '0.02em',
                                background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>TRIVO</span>
                        </motion.div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                            {[
                                { name: 'Information', route: '#information' },
                                { name: 'Features', route: '#features' },
                                { name: 'About', route: '#about' },
                                { name: 'Community', route: '#community' }
                            ].map((item) => (
                                <motion.button
                                    key={item.name}
                                    onClick={() => {
                                        if (item.route.startsWith('#')) {
                                            // Smooth scroll to section
                                            const element = document.querySelector(item.route);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }
                                        } else {
                                            router.push(item.route);
                                        }
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9375rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        padding: '0.5rem 0',
                                        transition: 'color 0.3s ease'
                                    }}
                                    whileHover={{
                                        color: 'var(--emerald-green)',
                                        scale: 1.05
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.name}
                                    <motion.div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: 'linear-gradient(90deg, var(--emerald-green), var(--bright-green))',
                                            scaleX: 0,
                                            transformOrigin: 'left'
                                        }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.button>
                            ))}

                            <motion.button
                                onClick={() => openAuthModal('login')}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    borderRadius: '10px',
                                    background: 'transparent',
                                    border: '1.5px solid var(--emerald-green)',
                                    color: 'var(--emerald-green)',
                                    fontSize: '0.9375rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                                whileHover={{
                                    borderColor: 'var(--bright-green)',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Login
                            </motion.button>

                            <motion.button
                                onClick={() => openAuthModal('signup')}
                                className="btn"
                                style={{
                                    padding: '0.625rem 1.5rem',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                    border: 'none',
                                    color: '#ffffff',
                                    fontSize: '0.9375rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
                                }}
                                whileHover={{ scale: 1.05, boxShadow: '0 6px 30px rgba(16, 185, 129, 0.6)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Sign Up
                            </motion.button>
                        </div>
                    </div>
                </nav>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Information Section */}
                    <section id="information" style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '4rem 2rem 3rem',
                        width: '100%'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '4rem',
                            alignItems: 'center'
                        }}>
                            <div>
                                <motion.h1
                                    style={{
                                        fontSize: '3.5rem',
                                        fontWeight: '800',
                                        lineHeight: '1.1',
                                        marginBottom: '1.5rem',
                                        background: 'linear-gradient(135deg, var(--text-primary), var(--emerald-green), var(--bright-green))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        backgroundSize: '200% 200%',
                                        animation: 'gradient-flow 5s ease infinite'
                                    }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    Real-time intelligence<br />for a living planet
                                </motion.h1>

                                <motion.p
                                    style={{
                                        fontSize: '1.125rem',
                                        color: 'var(--text-secondary)',
                                        lineHeight: '1.8',
                                        marginBottom: '2.5rem',
                                        maxWidth: '540px'
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                >
                                    Monitor air, water, forests, and biodiversity through a unified environmental dashboard. Smart data. Smarter action. A greener future.
                                </motion.p>

                                <motion.div
                                    style={{ display: 'flex', gap: '1.25rem', marginBottom: '3rem' }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                >
                                    <motion.button
                                        onClick={() => router.push('/')}
                                        className="btn"
                                        style={{
                                            padding: '1rem 2rem',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                            border: 'none',
                                            color: '#ffffff',
                                            fontSize: '1.0625rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: '0 12px 36px rgba(16, 185, 129, 0.6)'
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Explore Dashboard
                                        <ArrowRight style={{ width: '20px', height: '20px' }} />
                                    </motion.button>

                                    <motion.button
                                        style={{
                                            padding: '1rem 2rem',
                                            borderRadius: '12px',
                                            background: 'var(--glass-white)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1.5px solid var(--glass-border)',
                                            color: 'var(--text-primary)',
                                            fontSize: '1.0625rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                        whileHover={{
                                            background: 'var(--glass-white-strong)',
                                            borderColor: 'var(--emerald-green)',
                                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Join the Movement
                                    </motion.button>
                                </motion.div>

                                <motion.div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '1rem'
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.8 }}
                                >
                                    {[
                                        { value: '2.1M', label: 'Hectares Monitored', icon: TreePine },
                                        { value: '156K', label: 'Species Tracked', icon: Leaf },
                                    ].map((stat, i) => {
                                        const StatIcon = stat.icon;
                                        return (
                                            <div
                                                key={stat.label}
                                                className="glass-card"
                                                style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
                                            >
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '10px',
                                                    background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <StatIcon style={{ width: '24px', height: '24px', color: '#ffffff' }} />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--emerald-green)', marginBottom: '0.25rem' }}>
                                                        {stat.value}
                                                    </p>
                                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{stat.label}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            </div>

                            <motion.div
                                style={{
                                    height: '600px',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    background: 'var(--glass-dark)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid var(--glass-border)',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(16, 185, 129, 0.2)',
                                    position: 'relative'
                                }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                <RealisticEarth />
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'radial-gradient(circle at center, transparent 40%, rgba(10, 25, 47, 0.8) 100%)',
                                    pointerEvents: 'none'
                                }} />
                            </motion.div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section id="features" style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '3rem 2rem',
                        width: '100%'
                    }}>
                        <motion.div
                            style={{ textAlign: 'center', marginBottom: '3rem' }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                background: 'linear-gradient(135deg, var(--text-primary), var(--emerald-green))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                Environmental Impact in Real-Time
                            </h2>
                            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                                Track the planet's vital signs with precision and act on data-driven insights.
                            </p>
                        </motion.div>

                        <AnimatedStats stats={statsData} />
                    </section>

                    {/* About Section */}
                    <section id="about" style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '4rem 2rem',
                        width: '100%'
                    }}>
                        <motion.div
                            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 style={{
                                fontSize: '2.75rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                background: 'linear-gradient(135deg, var(--text-primary), var(--emerald-green), var(--purple-accent))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                Powerful Environmental Insights
                            </h2>
                            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
                                Track and visualize the Earth's vital signs with our advanced, intuitive platform.
                            </p>
                        </motion.div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1.5rem'
                        }}>
                            {features.map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={feature.title}
                                        className="glass-card"
                                        style={{
                                            padding: '2.5rem',
                                            position: 'relative',
                                            borderImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(139, 92, 246, 0.2)) 1'
                                        }}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: i * 0.1, duration: 0.6 }}
                                        whileHover={{ scale: 1.03 }}
                                    >
                                        <motion.div
                                            style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '16px',
                                                background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '1.5rem',
                                                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                                            }}
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Icon style={{ width: '32px', height: '32px', color: '#ffffff' }} />
                                        </motion.div>
                                        <h3 style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '600',
                                            marginBottom: '0.75rem',
                                            color: 'var(--text-primary)'
                                        }}>
                                            {feature.title}
                                        </h3>
                                        <p style={{
                                            fontSize: '1rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: '1.7'
                                        }}>
                                            {feature.description}
                                        </p>

                                        <div style={{
                                            position: 'absolute',
                                            top: '20px',
                                            right: '20px',
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: 'var(--emerald-green)',
                                            boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
                                        }} />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Community/Footer Section */}
                <footer id="community" style={{
                    borderTop: '1px solid var(--glass-border)',
                    padding: '3rem 0',
                    background: 'var(--glass-dark)',
                    backdropFilter: 'blur(20px)',
                    marginTop: 'auto'
                }}>
                    <div style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '0 2rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '3rem'
                    }}>
                        <div>
                            <h4 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                marginBottom: '1rem',
                                color: 'var(--text-primary)'
                            }}>About</h4>
                            <p style={{
                                fontSize: '0.9375rem',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.7'
                            }}>
                                TRIVO is a digital platform dedicated to environmental transparency and sustainable innovation.
                            </p>
                        </div>

                        <div>
                            <h4 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                marginBottom: '1rem',
                                color: 'var(--text-primary)'
                            }}>Quick Links</h4>
                            {[
                                { name: 'Information', route: '#information' },
                                { name: 'Features', route: '#features' },
                                { name: 'About', route: '#about' },
                                { name: 'Community', route: '#community' }
                            ].map(link => (
                                <motion.p
                                    key={link.name}
                                    onClick={() => {
                                        const element = document.querySelector(link.route);
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                    style={{
                                        fontSize: '0.9375rem',
                                        color: 'var(--text-secondary)',
                                        marginBottom: '0.625rem',
                                        cursor: 'pointer',
                                        transition: 'color 0.3s ease'
                                    }}
                                    whileHover={{ color: 'var(--emerald-green)', x: 5 }}
                                >
                                    {link.name}
                                </motion.p>
                            ))}
                        </div>

                        <div>
                            <h4 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                marginBottom: '1rem',
                                color: 'var(--text-primary)'
                            }}>Contact</h4>
                            <p style={{
                                fontSize: '0.9375rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '0.625rem'
                            }}>
                                support@trivo.io
                            </p>
                            <p style={{
                                fontSize: '0.9375rem',
                                color: 'var(--text-secondary)'
                            }}>
                                +91 00000 00000
                            </p>
                        </div>

                        <div>
                            <h4 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                marginBottom: '1rem',
                                color: 'var(--text-primary)'
                            }}>Social</h4>
                            <div style={{ display: 'flex', gap: '0.875rem' }}>
                                {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                                    <motion.div
                                        key={i}
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                        }}
                                        whileHover={{
                                            scale: 1.15,
                                            rotate: 360,
                                            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)'
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Icon style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        maxWidth: '1400px',
                        margin: '2.5rem auto 0',
                        padding: '0 2rem',
                        textAlign: 'center',
                        borderTop: '1px solid var(--glass-border)',
                        paddingTop: '2rem'
                    }}>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
                            © 2026 <span style={{
                                background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontWeight: '600'
                            }}>TRIVO</span>. Protecting tomorrow.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Authentication Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={closeAuthModal}
                initialView={authView}
            />
        </>
    );
}
