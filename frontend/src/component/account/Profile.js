
import React, { useEffect, useState } from 'react';
import ApiService from '../../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testsTaken, setTestsTaken] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    ApiService.getUserProfile(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Lấy số bài test đã làm
    ApiService.getUserTestsCount(userId)
      .then(data => setTestsTaken(data.count))
      .catch(() => setTestsTaken(0));
  }, [userId]);

  if (loading) return <div>Đang tải thông tin...</div>;
  if (!user) return <div>Không tìm thấy thông tin user.</div>;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#fff'
    }}>
      <div style={{
        backgroundColor: '#f4eded',
        width: '450px',
        minHeight: '500px',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span role="img" aria-label="user">👤</span> {user.fullname || user.email}
        </h2>
        <p>Email: {user.email}</p>
        <p>Ngày tạo: {new Date(user.createdAt).toLocaleDateString()}</p>
        <p>Xác thực: {user.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</p>
        <img
          src="image/pinkpantherheart.png"
          alt="Pink Panther"
          style={{ width: '100px', float: 'right', marginTop: '160px' }}
        />
      </div>
    </div>
  );
};

export default Profile;
