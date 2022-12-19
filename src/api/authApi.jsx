import Axios from 'axios';
const url = process.env.REACT_APP_AUTH_API_URL;

export const signup = async (body) => {
  const res = await Axios.post(url + '/auth/signup', body);
  return res;
};
export const login = async (body) => {
  const tempObj = {
    userType: 'author',
    ...body,
  };
  const res = await Axios.post(url + '/auth/login', tempObj);
  return res;
};
export const forgotPassword = async (body) => {
  const res = await Axios.post(url + '/auth/password/generateResetLink', body);
  return res;
};
export const resetPassword = async (body) => {
  const res = await Axios.post(url + '/auth/password/reset', body);
  return res;
};
export const checkUserApi = async (body) => {
  const res = await Axios.post(url + '/user/check', body);
  return res;
};
export const getUserApi = async (body, headers) => {
  const res = await Axios.post(url + '/user/get', body, headers);
  return res;
};
export const updateUserApi = async (body, headers) => {
  const res = await Axios.post(url + '/user/update', body, headers);
  return res;
};
export const updateTeacherApi = async (body, headers) => {
  const res = await Axios.post(url + '/user/update/teacher', body, headers);
  return res;
};
export const getOtpApi = async (body, headers) => {
  const res = await Axios.post(url + '/auth/otp/get', body, headers);
  return res;
};
export const verifyOtpApi = async (body, headers) => {
  const res = await Axios.post(url + '/auth/otp/verify', body, headers);
  return res;
};
export const loginWithOtpApi = async (body, headers) => {
  const res = await Axios.post(url + '/auth/otp/login', body, headers);
  return res;
};
export const loginWithoutOtpApi = async (body, headers) => {
  const res = await Axios.post(url + '/auth/loginwithoutotp', body, headers);
  return res;
};
export const createOrgApi = async (body) => {
  const res = await Axios.post(url + '/org/create', body);
  return res;
};