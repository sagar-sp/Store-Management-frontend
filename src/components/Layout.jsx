import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  ClipboardList, 
  Layers, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User,
  Settings,
  Bell
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Navbar = ({ toggleSidebar }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 glass sticky top-0 z-40 px-6 flex items-center justify-between border-b dark:border-slate-800">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500">
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold dark:text-white hidden md:block">Store Management</h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
           <Bell size={20} />
           <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

        <div className="flex items-center space-x-3 group cursor-pointer relative">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
            <User size={18} />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold dark:text-white uppercase truncate max-w-[80px]">{user?.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{user?.role}</p>
          </div>
          
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
            <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2">
              <User size={16} /> <span>Profile Settings</span>
            </button>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center space-x-2">
              <LogOut size={16} /> <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex transition-colors">

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 glass border-r dark:border-slate-800 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out`}>
        <div className="h-16 flex items-center px-6 border-b dark:border-slate-800">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-primary-500/30">
            <ShoppingCart className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">RJSPM Store</h1>
        </div>

        <nav className="p-4 space-y-2">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/products" icon={Package} label="Products" />
          <SidebarItem to="/categories" icon={Layers} label="Categories" />
          <SidebarItem to="/orders" icon={ShoppingCart} label="Orders" />
          <SidebarItem to="/customers" icon={Users} label="Customers" />
          <SidebarItem to="/inventory" icon={ClipboardList} label="Inventory" />
          <div className="pt-4 mt-4 border-t dark:border-slate-800">
            <SidebarItem to="/settings" icon={Settings} label="Settings" />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
};
