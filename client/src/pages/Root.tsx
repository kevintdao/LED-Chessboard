import {
  ArrowLeftOnRectangleIcon as LogoutIcon,
  ArrowRightOnRectangleIcon as LoginIcon,
} from '@heroicons/react/24/solid';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { Link, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

const getInitials = (name: string) => {
  const names = name.split(' ');
  let initials = names[0]?.substring(0, 1).toUpperCase();

  if (initials && names.length > 1) {
    initials += names[names.length - 1]?.substring(0, 1).toUpperCase();
  }
  return initials;
};

export default function Root() {
  const auth = getAuth();
  const [user] = useAuthState(auth);

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  console.log(user);

  return (
    <div className="flex flex-col h-screen space-y-2">
      <header>
        <nav className="relative w-full flex flex-wrap items-center justify-between py-3 bg-dark-400 text-white hover:text-gray-700 focus:text-gray-700 shadow-lg h-16">
          <div className="container-fluid w-full flex flex-wrap items-center justify-between px-4">
            <div className="container-fluid">
              <Link
                className="text-xl font-bold inline-flex items-center"
                to="/"
              >
                <span className="animate-text bg-gradient-to-r from-teal-500 via-purple-500  to-orange-500 bg-clip-text text-transparent">
                  ♟ LED Chess
                  {/* Home */}
                </span>
              </Link>
            </div>
            <div className="container-fluid">
              {user ? (
                <div className="flex gap-2 items-center">
                  <div className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                    <span className="font-normal text-gray-600 dark:text-gray-300">
                      {/* <img src={user.photoURL} alt="profile-picture" /> */}
                      {getInitials(user.displayName as string)}
                    </span>
                  </div>
                  <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                    {user.displayName}
                  </span>
                  <button
                    className="bg-dark-200 p-1 border rounded-md text-white hover:bg-dark-300 hover:text-[#edeed1] hover:border-[#edeed1] inline-flex items-center gap-1"
                    onClick={handleLogout}
                  >
                    <LogoutIcon className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  className="bg-dark-200 p-1 border rounded-md text-white hover:bg-dark-300 hover:text-[#edeed1] hover:border-[#edeed1] inline-flex items-center gap-1"
                  onClick={handleLogin}
                >
                  <LoginIcon className="w-4 h-4" />
                  Log In
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      {/* <footer className="w-full text-center p-4 sticky bottom-0 bg-dark-400">
        <div className="text-white">Footer</div>
      </footer> */}
    </div>
  );
}
