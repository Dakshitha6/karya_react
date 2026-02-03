import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavigation from '../components/SideNav/SideNavigation';
import { useUserStore } from '../store/userStore';
import './MainLayout.scss';

const MainLayout = () => {
  const { setApplicationLoaded } = useUserStore();

  useEffect(() => {
    // Hide splash screen loader
    setApplicationLoaded(true);
  }, [setApplicationLoaded]);

  return (
    <div className="main-layout">
      <nav id="navbar" className="navbar">
        <h2>KARYA</h2>
        <SideNavigation showMenu={false} />
      </nav>
      <div className="main-content">
        <aside id="sidebar" className="sidebar">
          <SideNavigation showMenu={true} />
        </aside>
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
