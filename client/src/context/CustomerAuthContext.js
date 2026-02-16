import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { customerAuthService } from '../services/api';

const CustomerAuthContext = createContext();

const isActivePremium = (user) => {
    if (!user) return false;
    if (user.role === 'premium') {
        const expiry = user.premiumActiveUntil ? new Date(user.premiumActiveUntil).getTime() : 0;
        return expiry > Date.now();
    }
    return false;
};

export const useCustomerAuth = () => {
    const context = useContext(CustomerAuthContext);
    if (!context) {
        throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
    }
    return context;
};

export const CustomerAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = useCallback(async () => {
        const token = localStorage.getItem('customerToken');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await customerAuthService.getProfile();
            setUser(response.data || null);
        } catch {
            localStorage.removeItem('customerToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    const requestOtp = async (mobile) => {
        const response = await customerAuthService.requestOtp(mobile);
        return response.data;
    };

    const verifyOtp = async (payload) => {
        const response = await customerAuthService.verifyOtp(payload);
        const { token, user: userData } = response.data || {};
        if (token) {
            localStorage.setItem('customerToken', token);
        }
        setUser(userData || null);
        return response.data;
    };

    const loginWithPassword = async (payload) => {
        const response = await customerAuthService.login(payload);
        const { token, user: userData } = response.data || {};
        if (token) {
            localStorage.setItem('customerToken', token);
        }
        setUser(userData || null);
        return response.data;
    };

    const requestSignupOtp = async (payload) => {
        const response = await customerAuthService.requestSignupOtp(payload);
        return response.data;
    };

    const verifySignupOtp = async (payload) => {
        const response = await customerAuthService.verifySignupOtp(payload);
        const { token, user: userData } = response.data || {};
        if (token) {
            localStorage.setItem('customerToken', token);
        }
        setUser(userData || null);
        return response.data;
    };

    const requestForgotOtp = async (payload) => {
        const response = await customerAuthService.requestForgotOtp(payload);
        return response.data;
    };

    const verifyForgotOtp = async (payload) => {
        const response = await customerAuthService.verifyForgotOtp(payload);
        return response.data;
    };

    const logout = async () => {
        try {
            await customerAuthService.logout();
        } catch {
            // Ignore API errors and clear local session.
        } finally {
            localStorage.removeItem('customerToken');
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        isLoggedIn: Boolean(user),
        isPremium: isActivePremium(user),
        requestOtp,
        verifyOtp,
        loginWithPassword,
        requestSignupOtp,
        verifySignupOtp,
        requestForgotOtp,
        verifyForgotOtp,
        refreshProfile,
        setUser,
        logout
    };

    return (
        <CustomerAuthContext.Provider value={value}>
            {children}
        </CustomerAuthContext.Provider>
    );
};
