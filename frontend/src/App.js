import Header from './component/header/Header';
import { Outlet } from 'react-router-dom';
import HomeMenu from './component/home/HomeMenu';

function App() {
  return (
    <div className="app-container">
      <div className="header-container">
        <Header />
      </div>
      <div className="main-container" style={{ display: 'flex' }}>
        <div className="sideber-container">
          <HomeMenu />
        </div>
        <div className="conten-container" style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
