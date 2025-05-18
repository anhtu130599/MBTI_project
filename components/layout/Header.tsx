import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/outline';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
          <UserIcon className="w-5 h-5" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Thông tin cá nhân
            </Link>
            <Link
              href="/change-password"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Đổi mật khẩu
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 