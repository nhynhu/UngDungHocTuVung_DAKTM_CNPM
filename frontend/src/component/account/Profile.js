const Profile = () => {
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
          <span role="img" aria-label="user">👤</span> Tieu Anh Huy
        </h2>
        <p>Email: tieuanhhuy3003@gmail.com</p>
        <p>Topics: 0</p>
        <p>Tests: 0</p>
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
