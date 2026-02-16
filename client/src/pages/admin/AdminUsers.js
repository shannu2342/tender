import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleTogglePremium = async (user) => {
        try {
            const premiumActiveUntil = user.role === 'premium'
                ? null
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            await api.put(`/users/${user._id}`, {
                role: user.role === 'premium' ? 'user' : 'premium',
                isPremium: user.role !== 'premium',
                premiumActiveUntil
            });
            fetchUsers();
        } catch (error) {
            console.error('Error updating premium status:', error);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div className="loading"></div>
                <p style={{ marginTop: '20px', color: '#718096' }}>Loading users...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '30px', color: '#2d3748' }}>Manage Users</h1>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Mobile</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Plan</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Premium Until</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Created At</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px', color: '#1f2937', fontSize: '0.9rem' }}>{user.name}</td>
                            <td style={{ padding: '12px', color: '#1f2937', fontSize: '0.9rem' }}>{user.email}</td>
                            <td style={{ padding: '12px', color: '#1f2937', fontSize: '0.9rem' }}>{user.mobile}</td>
                            <td style={{ padding: '12px', color: '#1f2937', fontSize: '0.9rem' }}>{user.role === 'premium' ? 'Premium' : 'Normal'}</td>
                            <td style={{ padding: '12px', color: '#1f2937', fontSize: '0.9rem' }}>
                                {user.premiumActiveUntil ? new Date(user.premiumActiveUntil).toLocaleDateString() : '-'}
                            </td>
                            <td style={{ padding: '12px', color: '#1f2937', fontSize: '0.9rem' }}>{new Date(user.createdAt).toLocaleString()}</td>
                            <td style={{ padding: '12px' }}>
                                <button
                                    onClick={() => handleTogglePremium(user)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: user.role === 'premium' ? '#475569' : '#15803d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        marginRight: '8px'
                                    }}
                                >
                                    {user.role === 'premium' ? 'Set Normal' : 'Set Premium'}
                                </button>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
