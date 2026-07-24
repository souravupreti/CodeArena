import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import { LogOut, Shield, User as UserIcon } from 'lucide-react';

function TopNav() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navItem = ({ isActive }) =>
    `py-5 text-[15px] transition ${isActive ? 'text-white font-semibold' : 'text-[#b8b8b8] hover:text-white'}`;

  return (
    <nav className="sticky top-0 z-50 h-[62px] border-b border-[#303030] bg-[#222222]/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1480px] items-center justify-between px-4 lg:px-7">
        <div className="flex h-full items-center gap-7">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <div className="absolute h-6 w-6 rotate-45 rounded-[4px] border-[3px] border-l-[#ffa116] border-t-[#ffa116] border-r-white/80 border-b-white/80" />
              <div className="absolute h-2.5 w-2.5 rounded-full bg-[#222222]" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">CodeArena</span>
          </NavLink>

          <div className="hidden h-full items-center gap-7 md:flex">
            <NavLink to="/" className={navItem}>Problems</NavLink>
            <NavLink to="/leaderboard" className={navItem}>Leaderboard</NavLink>
            <NavLink to="/profile" className={navItem}>Profile</NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navItem}>
                Admin
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <NavLink to="/admin" className="hidden rounded-md bg-[#2b241b] px-3 py-2 text-xs font-semibold text-[#ffa116] transition hover:bg-[#3d2a12] lg:inline-flex lg:items-center lg:gap-2">
              <Shield size={14} />
              Admin
            </NavLink>
          )}
          <NavLink to="/profile" className="flex items-center gap-2 rounded-md bg-[#303030] px-2.5 py-2 text-sm text-white transition hover:bg-[#3a3a3a]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#74a5ff] text-sm font-bold text-[#10224a]">
              {user?.firstName?.[0]?.toUpperCase() || <UserIcon size={15} />}
            </span>
            <span className="hidden max-w-24 truncate lg:block">{user?.firstName || 'User'}</span>
          </NavLink>
          <button onClick={handleLogout} className="rounded-md p-2 text-[#b8b8b8] transition hover:bg-[#3a2525] hover:text-[#ff6b6b]" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
