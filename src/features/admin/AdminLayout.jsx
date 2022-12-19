import { Box } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import AdminLogin from './AdminLogin';
import ManageAuthors from './Authors/ManageAuthors';
import ManageBooks from './Books/ManageBooks';
import MyOrganization from './MyOrganization/MyOrganization';
import Sidebar from './SideBar';
import ManageTeachers from './Teachers/ManageTeachers';
import ManageTests from './Tests/ManageTests';
import { Usage } from './Usage/Usage';
import { ViewResults } from './ViewResults/ViewResults';
import { currentUser } from '../auth/userSlice';

const AdminLayout = () => {
  const user = useSelector(currentUser);
  return (
    <>
      {user && user.type==='admin' ? (
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Routes>
            <Route path="/" element={<MyOrganization />} />
            <Route path="/results" element={<ViewResults />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/tests" element = {<ManageTests />} />
            <Route path="/books" element = {<ManageBooks />} />
            <Route path="/authors" element = {<ManageAuthors />} />
            <Route path="/teachers" element = {<ManageTeachers />} />
            <Route
              path="*"
              element={
                <main style={{ padding: '1rem' }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Routes>
        </Box>
       ) : (
        <AdminLogin />
      )} 
    </>
  );
};

export default AdminLayout;
