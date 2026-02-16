import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if admin is already authenticated
        const token = localStorage.getItem('adminToken');
        if (token) {
            authService.getProfile()
                .then(response => {
                    setAdmin(response.data);
                })
                .catch(() => {
                    localStorage.removeItem('adminToken');
                    setAdmin(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const { token, admin: adminData } = response.data;

            localStorage.setItem('adminToken', token);
            setAdmin(adminData);

            return { success: true, data: { token, admin: adminData } };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    const updateProfile = async (data) => {
        try {
            const response = await authService.updateProfile(data);
            setAdmin(response.data);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            const response = await authService.changePassword(oldPassword, newPassword);
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password change failed'
            };
        }
    };

    const value = {
        admin,
        loading,
        login,
        logout,
        updateProfile,
        changePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};