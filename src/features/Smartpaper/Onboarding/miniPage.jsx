import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { currentUser } from '../../auth/userSlice';

const MiniPage = () => {
  //apply restriction
  const user = useSelector(currentUser);
  if (user.organizationId) {
    return <Navigate to='/smartpaper/home' replace />;
  }
  return <div>MiniPage</div>;
};

export default MiniPage;
