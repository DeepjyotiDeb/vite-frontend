import Axios from 'axios';
const url = process.env.REACT_APP_AUTH_API_URL;

export const createGroupApi = async (body, headers) => {
    const res = await Axios.post(url + '/group/create', body, headers);
    return res;
  };
export const updateGroupApi = async (body, headers) => {
const res = await Axios.post(url + '/group/update', body, headers);
return res;
};
export const getAllGroupsApi = async (body, headers) => {
  const res = await Axios.post(url + '/group/all', body, headers);
  return res;
};
export const getGroupDetailsApi = async (body, headers) => {
  const res = await Axios.post(url + '/group/get', body, headers);
  return res;
};
export const deleteGroupsApi = async (body, headers) => {
  const res = await Axios.post(url + '/group/delete', body, headers);
  return res;
};
