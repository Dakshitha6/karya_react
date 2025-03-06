import SideNavigation from '../components/SideNav/SideNavigation';
import { Outlet } from 'react-router-dom';
import { Frame } from '@dentsu-ui/components';

const MainLayout = () => {
    return (
        <>
            <Frame navigation={<SideNavigation />}>
                <Outlet />
            </Frame>
        </>
    )
}

export default MainLayout