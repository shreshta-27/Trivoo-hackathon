import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user from token on mount
    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await fetch('http://localhost:5000/api/users/profile', {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.user);
                        setToken(storedToken);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Failed to load user:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            router.push('/dashboard');
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    profession: 'System Admin' // Default profession
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            router.push('/dashboard');
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    };

    const googleLogin = async (googleToken) => {
        try {
            // Validate token by fetching user data
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${googleToken}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Google login failed');
            }

            setUser(data.user);
            setToken(googleToken);
            localStorage.setItem('token', googleToken);
            return { success: true };
        } catch (error) {
            console.error('Google login error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        router.push('/landing');
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        googleLogin,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
