import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import {
  AdminRoute,
  AuthorRoute,
  PublicRoute,
  TeacherRoute,
} from './ProtectedRoutes';
import AdminLayout from '../features/admin/AdminLayout';
import { ForgotPassword } from '../features/auth/ForgotPassword';
import { Home } from '../features/auth/Home';
import { Login } from '../features/auth/Login';
import { ResetPassword } from '../features/auth/ResetPassword';
import { Signup } from '../features/auth/Signup';
import { currentUser } from '../features/auth/userSlice';
import { Dashboard } from '../features/authoringTool/Dashboard';
import Layout from '../features/Smartpaper/Navigation/Layout';
import MiniPage from '../features/Smartpaper/Onboarding/miniPage';
export const Router = () => {
  const user = useSelector(currentUser);
  // const user = JSON.parse(localStorage.getItem('user'));

  // const PublicRoute = ({ user, redirectPath = 'authoring/books' }) => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<PublicRoute user={user} />}>
          <Route path='/' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Signup />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route
            path='password-reset/:userId/:userToken'
            element={<ResetPassword />}
          />
        </Route>
        <Route element={<AuthorRoute user={user} />}>
          <Route path='authoring/*' element={<Dashboard />} />
        </Route>
        <Route element={<TeacherRoute user={user} />}>
          <Route path='smartpaper/*' element={<Layout />} />
        </Route>
        <Route element={<AdminRoute user={user} />}>
          <Route path='admin/*' element={<AdminLayout />} />
        </Route>
        <Route path='smartpaper/minipage' element={<MiniPage />} />
        {/* <Route element={<CommonRoute user={user} />}>
        <Route path='authoring/*' element={<Dashboard />} />
        <Route path='smartpaper/*' element={<Layout />} />
      </Route> */}
        <Route
          path='*'
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </Suspense>
  );
};
