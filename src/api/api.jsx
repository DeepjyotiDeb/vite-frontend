import axios from 'axios';

const FormData = require('form-data');
const smartApi = process.env.REACT_APP_API_SMARTPAPER;
const authoringUrl = process.env.REACT_APP_API_URL;

const encodeImageFileAsURL = async (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      const base64data = reader.result;
      resolve(base64data);
    };
  });

const getScanResult = async ({
  targetName,
  targetImages,
  // orgName,
  requestId,
  // userName,
  receivedAt,
  fileName,
  groupId,
  organizationId,
  saveCrops,
  doQualityCheck,
  metadata,
}) => {
  const url = `${smartApi}/scan/target/form`;

  const formData = new FormData();
  formData.append('scanId', requestId);
  formData.append('targetName', targetName);
  // formData.append('orgName', orgName);
  targetImages.forEach((image) => {
    formData.append('targetImage', image);
  });
  formData.append('metadata', metadata);
  formData.append('fileName', fileName);
  // formData.append('userName', userName);
  formData.append('receivedAt', receivedAt);
  formData.append('groupId', groupId);
  formData.append('organizationId', organizationId);
  formData.append('saveCrops', saveCrops);
  formData.append('doQualityCheck', doQualityCheck);
  const result = await axios.post(url, formData, {
    headers: {
      ...formData.getHeaders,
    },
  });
  return result;
};

// const getPageMetadata = async (pageIds) => {
//   const result = await axios.post(
//     'https://prod.paperflowapp.com/authoring-page-metadata/pagemetadata/getPageMetadataDetails',
//     {
//       pageIds: pageIds,
//     }
//   );
//   return result;
// };

const updateScan = async (obj) => {
  const url = `${smartApi}/reporting/update`;
  const result = await axios.post(url, obj);
  return result;
};

const addReport = async (obj) => {
  const url = `${smartApi}/reporting/add`;
  try {
    const result = await axios.post(url, obj);
    return result;
  } catch (error) {
    console.log('error', error);
  }
};

const generateReport = async (obj) => {
  const result = await axios.post(smartApi + '/reporting/generate', obj);
  return result;
};

const removeReport = async (obj) => {
  const url = `${smartApi}/reporting/remove`;
  const result = await axios.post(url, obj);
  return result;
};

const exportResults = async (obj) => {
  const url = `${smartApi}/reporting/export`;
  const result = await axios.post(url, obj);
  return result;
};

const downloadTest = async ({ body, headers }) => {
  const result = await axios.post(
    authoringUrl + '/test/download',
    body,
    headers
  );
  return result;
};

const viewResults = async (body, headers) => {
  const url = 'https://devauth.smartpaperapi.com/analytics/result';
  const result = await axios.post(url, body, headers);
  return result;
};

export {
  addReport,
  downloadTest,
  encodeImageFileAsURL,
  exportResults,
  generateReport,
  // getPageMetadata,
  getScanResult,
  removeReport,
  updateScan,
  viewResults,
};
