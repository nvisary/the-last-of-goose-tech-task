import { useUserStore } from '@entities/User/model/store';
import { Button } from '@shared/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">
              THE LAST OF <span className="text-blue-600">GOOSE</span>
            </h1>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <span className="text-gray-600 font-medium">ROUNDS LIST</span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-gray-800">{user.username}</span>
                <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded-full">
                  {user.role}
                </span>
              </div>
              <Button variant="secondary" className="!w-auto !py-2 !px-4 text-sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
