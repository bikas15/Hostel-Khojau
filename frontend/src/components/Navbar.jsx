import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HostelKhojauLogo from '../assets/hostelhub.png';
import NotificationBell from './NotificationBell';

const publicLinks = [
  { to: '/home', label: 'Home' },
  { to: '/hostel', label: 'Hostels' },
  { to: '/map-search', label: 'Map Search' },
];

const guestLinks = [
  { to: '/login', label: 'Login' },
  { to: '/signup', label: 'Sign Up' },
];

const ownerDashboard = { to: '/owner/hostels', label: 'Owner Dashboard' };
const adminDashboard = { to: '/admin/dashboard', label: 'Admin Dashboard' };
const roleLinks = {
  user: [{ to: '/my-bookings', label: 'My Bookings' }],
  owner: [{ to: '/register-hostel', label: 'Register Hostel' }, ownerDashboard],
  admin: [adminDashboard],
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuButton = useRef(null);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/home');
  };

  const isOwnerDashboard = location.pathname === ownerDashboard.to && user?.role === 'owner';
  const isAdminDashboard = location.pathname === adminDashboard.to && user?.role === 'admin';
  const links = isOwnerDashboard
    ? [ownerDashboard]
    : isAdminDashboard
      ? [adminDashboard]
      : [...publicLinks, ...(user ? roleLinks[user.role] ?? [] : guestLinks)];

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && menuOpen) {
      setMenuOpen(false);
      menuButton.current?.focus();
    }
  };

  return (
    <nav aria-label="Main navigation" onKeyDown={handleKeyDown} className="sticky top-0 z-30 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 px-4 py-2 sm:px-6 lg:gap-x-5 lg:px-8">
        <NavLink to="/home" onClick={() => setMenuOpen(false)} className="mr-auto flex shrink-0 items-center gap-2">
          <img src={HostelKhojauLogo} alt="" className="h-12 w-12 object-contain lg:h-14 lg:w-14" />
          <span className="font-poppins text-xl font-bold text-red-600 sm:text-2xl">Hostel Hub</span>
        </NavLink>

        <div
          id="main-navigation-links"
          className={`order-last max-h-[calc(100dvh-4.5rem)] w-full flex-col gap-1 overflow-y-auto border-t py-2 lg:order-none lg:max-h-none lg:overflow-visible lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-2 lg:border-0 lg:py-0 xl:gap-4 ${menuOpen ? 'flex' : 'hidden'}`}
        >
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex min-h-11 items-center rounded-md px-3 font-poppins text-sm hover:bg-gray-50 hover:text-black lg:px-2 xl:text-base ${isActive ? 'font-semibold text-black underline underline-offset-4' : 'text-gray-600'}`
              }
            >
              {label}
            </NavLink>
          ))}
          {user && (
            <button type="button" onClick={handleLogout} className="min-h-11 self-start rounded-lg bg-red-600 px-4 py-2 font-poppins text-sm text-white hover:bg-red-700 lg:self-auto">
              Logout
            </button>
          )}
        </div>

        {user && !isAdminDashboard && <NotificationBell />}
        <button
          ref={menuButton}
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-controls="main-navigation-links"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(open => !open)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 lg:hidden"
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
