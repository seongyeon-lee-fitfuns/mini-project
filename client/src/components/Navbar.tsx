'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:7351/v2/console/authenticate/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      logout();
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">API Explorer</h1>
            </div>
          </div>
          {user && (
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 