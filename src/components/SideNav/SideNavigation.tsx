import { NavLink } from 'react-router-dom';
import 'primeicons/primeicons.css';
import { useUserStore } from '../../store/userStore';
import { useToast } from '../../hooks/useToast';
import { logoutUser } from '../../utils/authentication.function';
import { getAvatarLetters } from '../../utils/helper.function';
import './SideNavigation.scss';

interface SideNavigationProps {
  showMenu?: boolean;
}

const SideNavigation = ({ showMenu = false }: SideNavigationProps) => {
  const { userDetails } = useUserStore();
  const toast = useToast();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'pi pi-fw pi-th-large',
    },
    {
      label: 'Requests',
      path: '/assistance-requests',
      icon: 'pi pi-fw pi-tags',
    },
    {
      label: 'Users',
      path: '/users',
      icon: 'pi pi-fw pi-users',
    },
  ];

  const avatarText = userDetails.username
    ? getAvatarLetters(userDetails.username)
    : 'U';

  const handleLogout = async () => {
    try {
      await logoutUser(true);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure that you want to logout?')) {
      handleLogout();
    }
  };

  // Navbar user profile (top bar)
  if (!showMenu) {
    return (
      <div className="navbar-user-section">
        <div className="user-avatar" title={userDetails.username || 'User'}>
          {userDetails.profilePictureUrl ? (
            <img
              src={userDetails.profilePictureUrl}
              alt={userDetails.username || 'User'}
              className="avatar-image"
            />
          ) : (
            <span className="avatar-text">{avatarText}</span>
          )}
        </div>
        <span className="username">{userDetails.username || 'User'}</span>
      </div>
    );
  }

  // Sidebar menu
  return (
    <div className="sidebar-content">
      <div className="sidebar-menu">
        <nav className="menu-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `menu-item ${isActive ? 'active' : ''}`
              }
              end={item.path === '/dashboard'}
            >
              <i className={`menu-icon ${item.icon}`} />
              <span className="menu-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button
          className="logout-button"
          onClick={handleLogoutClick}
          type="button"
        >
          <i className="pi pi-chevron-circle-left logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideNavigation;
