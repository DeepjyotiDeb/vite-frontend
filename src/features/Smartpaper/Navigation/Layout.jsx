import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Navbar } from './AppBarDown';
import Sidebar from './SideBar';
import { Group } from '../Groups/Group';
import { Groups } from '../Groups/Groups';
import { Home } from '../Home/Home';
// import Library from '../Library/Library';
import { Onboarding } from '../Onboarding/Onboarding';
import { Result } from '../Result/Result';
import ScanTest from '../ScanTest/ScanTest';
import { Profile } from '../../../CommonComponent/Profile/Profile';

const Layout = () => {
  const [width, setWidth] = useState(0);
  const location = useLocation();

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  // console.log('router nav', router.pathname === '/[org_name]/home/scan');
  const restrictedPages = () => {
    const restrictedpaths = ['scan', 'result', 'onboarding'];
    if (restrictedpaths.some((item) => location.pathname.includes(item)))
      return false;
    else return true;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* {location.pathname !== `/smartpaper/home/scan` && //TODO needs user data?
        location.pathname !== `/smartpaper/home/result` && (
          <>{width > 600 ? <Sidebar /> : <Navbar />}</>
        )} */}
      {restrictedPages() && <>{width > 600 ? <Sidebar /> : <Navbar />}</>}
      {/* <>{width > 600 ? <Sidebar /> : <Navbar />}</> */}
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/onboarding' element={<Onboarding />} />
        <Route path='/home/scan' element={<ScanTest />} />
        <Route path='/home/result' element={<Result />} />

        <Route path='/classes' element={<Groups />} />
        <Route path='/classes/class' element={<Group />} />
        <Route path='/classes/:classId' element={<Group />} />
        <Route path='/classes/:classId/scan' element={<ScanTest />} />
        <Route path='/classes/:classId/result' element={<Result />} />
        <Route path='/classes/:classId/:testId/scan' element={<ScanTest />} />
        <Route path='/classes/:classId/:testId/result' element={<Result />} />
        <Route path='/profile' element={<Profile />} />
        <Route
          path='*'
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </Box>
  );
};

export default Layout;
