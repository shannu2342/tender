
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';

const ProtectedRoute = ({ element }) => {
    const { admin, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #e0e0e0',
                        borderTop: '2px solid #007bff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (!admin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <AdminLayout>{element}</AdminLayout>;
};

export default ProtectedRoute;