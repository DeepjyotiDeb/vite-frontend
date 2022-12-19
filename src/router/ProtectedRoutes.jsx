import { Navigate, Outlet } from 'react-router-dom';

import { Onboarding } from '../features/Smartpaper/Onboarding/Onboarding';

export const TeacherRoute = ({ user, redirectPath = 'login' }) => {
  if (!user) return <Navigate to={redirectPath} replace />;
  if (user.type === 'teacher' || user.type === 'student') {
    if (!user.organizationId || !user.language) {
      return <Onboarding user={user} />;
      // return <Navigate to='minipage' replace />;
    }
    return <Outlet />;
  }
  return <Navigate to={redirectPath} replace />;
};
export const AdminRoute = ({user, redirectPath = 'login'}) => {
  // if (!user) return <Navigate to={redirectPath} replace />;
if(user && user.type!=='admin'){
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />
};

export const AuthorRoute = ({ user, redirectPath = 'login' }) => {
  if (!user) return <Navigate to={redirectPath} replace />;
  if (user.type === 'author' || user.type === 'admin') return <Outlet />;
  return <Navigate to='smartpaper/home' replace />;
};

export const PublicRoute = ({ user, redirectPath = 'smartpaper/home' }) => {
  if (user) {
    if (user.type === 'teacher' || user.type === 'student') {
      return <Navigate to={redirectPath} replace />;
    } else if (user.type === 'author' || user.type === 'admin') {
      return <Navigate to='authoring/books' replace />;
    }
    
  }
  return <Outlet />;
};
