import React from 'react';
import HomeContent from './HomeContent';
const HomePage = () => {
    return (
        <div className="home-page" style={{ display: 'flex' }}>
            <div className="home-content" style={{ flex: 1 }}>
                <HomeContent />
            </div>
        </div>
    );
}
export default HomePage;