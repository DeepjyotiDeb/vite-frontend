import Axios from 'axios';
const url = process.env.REACT_APP_API_URL;
export const uploadBookApi = async (body, headers) => {
  const res = await Axios.post(url + '/upload/pdf', body, headers);
  return res;
};
export const getBookUrlApi = async (uploadUrl, pdfFile, options) => {
  const res = await Axios.put(uploadUrl, pdfFile, options);
  return res;
};

export const getAllBooksApi = async (body, headers) => {
  const res = await Axios.post(url + '/book/all', body, headers);
  return res;
};

export const uploadPageApi = async (body, headers) => {
  const res = await Axios.post(url + '/upload/pdf', body, headers);
  return res;
};

export const addPagesApi = async (body, headers) => {
  const res = await Axios.post(url + '/book/pages/add', body, headers);
  return res;
};

export const getFileUrlApi = async (uploadUrl, pdf, options) => {
  const res = await Axios.put(uploadUrl, pdf, options);
  return res;
};

export const getSkillsApi = async (body, headers) => {
  const res = await Axios.post(url + '/skills/get', body, headers);
  return res;
};
export const getAllSkillsApi = async (body, headers) => {
  const res = await Axios.post(url + '/skills/get/all', body, headers);
  return res;
};
export const addSkillApi = async (body, headers) => {
  const res = await Axios.post(url + '/skills/add', body, headers);
  return res;
};
export const deleteSkillApi = async (body, headers) => {
  const res = await Axios.post(url + '/skills/remove', body, headers);
  return res;
};
export const getPageMetaDataApi = async (body, headers) => {
  const res = await Axios.post(url + '/pageMetadata/get', body, headers);
  return res;
};
export const addPageMetaDataApi = async (body, headers) => {
  const res = await Axios.post(url + '/pageMetadata/add', body, headers);
  return res;
};

export const uploadThumbnailApi = async (body, headers) => {
  const res = await Axios.post(url + '/upload/thumbnail', body, headers);
  return res;
};
export const getThumbnailUrlApi = async (uploadUrl, pdf, options) => {
  const res = await Axios.put(uploadUrl, pdf, options);
  return res;
};
export const submitBookApi = async (body, headers) => {
  const res = await Axios.post(url + '/book/add', body, headers);
  return res;
};
export const getBooksApi = async (body, headers) => {
  const res = await Axios.post(url + '/book/get', body, headers);
  return res;
};
export const getBookDetailsApi = async (body, headers) => {
  const res = await Axios.post(url + '/book/getBookDetails', body, headers);
  return res;
};
export const updateBookApi = async (body, headers) => {
  const res = await Axios.post(url + '/book/update', body, headers);
  return res;
};
export const deleteBookApi = async (body, headers) => {
  const res = await Axios.post(url + '/book/remove', body, headers);
  return res;
};
export const getBookPagesApi = async (body, headers) => {
  const res = await Axios.post(url + '/book/getBookPages', body, headers);
  return res;
};
export const getUnusedPagesApi = async (body, headers) => {
  const res = await Axios.post(
    url + '/pageMetadata/getUnusedPages',
    body,
    headers
  );
  return res;
};
export const getPageDetailsApi = async (body, headers) => {
  const res = await Axios.post(url + '/pageMetadata/getDetails', body, headers);
  return res;
};
export const getSplitPagesApi = async (body, headers) => {
  const res = await Axios.post(
    url + '/pageMetadata/splitPages/get',
    body,
    headers
  );
  return res;
};
export const getSplitPageDetailsApi = async (body, headers) => {
  const res = await Axios.post(
    url + '/pageMetadata/get/splitPageDetails',
    body,
    headers
  );
  return res;
};
export const getTestsApi = async (body, headers) => {
  const res = await Axios.post(url + '/target/get/bookTargets', body, headers);
  return res;
};
export const getAllTests = async ({ body, headers }) => {
  const res = await Axios.post(url + '/target/get/all', body, headers);
  return res;
};
export const addTestApi = async (body, headers) => {
  const res = await Axios.post(url + '/target/add', body, headers);
  return res;
};
export const addOrg = async (body, headers) => {
  const res = await Axios.post(url + '/update/teacher', body, headers);
  return res;
};
export const deleteTestApi = async (body, headers) => {
  const res = await Axios.post(url + '/target/remove', body, headers);
  return res;
};
export const getQuestionsApi = async (body, headers) => {
  const res = await Axios.post(url + '/target/questions/get', body, headers);
  return res;
};
