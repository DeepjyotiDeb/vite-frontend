import Axios from 'axios';
const url = process.env.REACT_APP_AUTH_API_URL;
export const getOrgDetails = async (body) => {
    const res = await Axios.post(url + '/org/getDetails', body);
    return res;
  };

  export const getAllUsersByTypeApi = async (body, headers) => {
    const res = await Axios.post(url + '/user/all', body, headers);
    return res;
  };

export const generateNewCodeApi = async (body, headers) => {
  const res = await Axios.post(url + '/org/generate/inviteCode', body, headers);
  return res;
}
export const deleteUserApi = async (body, headers) => {
  const res = await Axios.post(url + '/user/delete', body, headers);
  return res;
}
export const getUsageDetails = async (body, headers) => {
  const res = await Axios.post(url + '/bill/monthlyUsage', body, headers);
  return res;
};