import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Layout as LayoutIcon, 
  Users, 
  UserCheck,
  GraduationCap,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { FetchDataProvider } from "../contexts/fetchDataContext"

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutIcon, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: UserCheck, label: 'Pending Approvals', path: '/pending' },
    { icon: GraduationCap, label: 'Classes', path: '/classes' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (

    <FetchDataProvider>
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-purple-600 text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-purple-700">
          <div className="flex items-center mb-8 p-2">
            <span className="text-2xl font-semibold text-white">Admin Portal</span>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className="flex items-center w-full p-3 text-white hover:bg-purple-600 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-white hover:bg-purple-600 rounded-lg transition-colors mt-auto"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 p-4">
        <div className="p-4 rounded-lg bg-white shadow-sm min-h-[calc(100vh-2rem)]">
          {children}
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
    </FetchDataProvider>
  );
}