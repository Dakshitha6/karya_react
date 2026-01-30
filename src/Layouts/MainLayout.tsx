import SideNavigation from '../components/SideNav/SideNavigation';
import { Outlet } from 'react-router-dom';
// Temporarily disabled Frame to avoid Dentsu platform loading issues
// import { Frame } from '@dentsu-ui/components';

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '250px', backgroundColor: '#f5f5f5', padding: '1rem' }}>
                <SideNavigation />
            </div>
            <div style={{ flex: 1, padding: '1rem' }}>
                <Outlet />
            </div>
        </div>
        // Original with Frame (can be re-enabled later):
        // <Frame navigation={<SideNavigation />}>
        //     <Outlet />
        // </Frame>
    )
}

export default MainLayout