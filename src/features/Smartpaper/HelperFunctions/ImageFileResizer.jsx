import { sha1 } from 'crypto-hash';
import Resizer from 'react-image-file-resizer';

export const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file, //file name
      900, //max width
      1600, //ht
      'jpeg', //format
      60, //quality
      0, //rotation
      (uri) => {
        resolve(uri);
      },
      'file',
      900,
      1600
    );
  });

export const hashImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      let result = sha1(reader.result);
      resolve(result);
    };
    return reader.readAsText(file);
  });
