/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import { UploadFile } from '@mui/icons-material';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import CircularProgressWithLabel from './CircularProgressWithlabel';

const defaultPDF = {
  'application/pdf': ['.pdf'],
};
const defaultImages = {
  'image/*': ['.jpg', '.jpeg', '.png'],
};
const percentage = 66;

const FileUploader = ({
  fileTypes,
  onDrop,
  onDropAccept,
  onDropReject,
  onDropError,
  multiple,
  disabled,
  children,
  progressBar = false,
  label,
  ...props
}) => {
  const [file, setFile] = useState(null);
  const [allowedTypes, setAllowedTypes] = useState(
    fileTypes === 'pdf' ? ['PDF'] : ['.jpg', '.jpeg', '.png']
  );
  const handleChange = (file) => {
    setFile(file);
  };
  const handleFiles = (e, acceptedFiles) => {
    console.log('event', e);
    console.log('acceptedFiles', acceptedFiles);
  };
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: fileTypes === 'pdf' ? defaultPDF : defaultImages,
    onDrop: onDrop,
    onDropAccepted: onDropAccept,
    onDropRejected: onDropReject,
    multiple: multiple === true ? true : false,
    disabled: disabled,
    onError: onDropError,
    maxFiles: multiple === false ? 1 : 100,
  });
  return (
    <>
      <section className='file-uploader'>
        <div className='file-drop'>
          <div className='file-dropzone' {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragAccept && <p>All files will be accepted</p>}
            {isDragReject && <p>Some files will be rejected</p>}
            {isDragActive && <p>Drop the files here ...</p>}
            {!isDragActive && !acceptedFiles.length > 0 && (
              <>
                <UploadFile fontSize='large' />
                <p>
                  {label ||
                    `Browse or Drag and Drop ${allowedTypes.join(
                      ', '
                    )} files here`}
                </p>
              </>
            )}
            {acceptedFiles.map((file) => (
              <p key={file.path}>
                {file.path} - {(file.size / 1000).toFixed(2)} Kbytes
              </p>
            ))}
            {acceptedFiles.length > 0 && progressBar && (
              <CircularProgressWithLabel value={percentage} />
            )}
          </div>
          {children}
        </div>
      </section>
      <ol
        style={{
          fontSize: '0.8rem',
          color: '#ff0000',
        }}
        type='1'
      >
        {fileRejections.map(({ file, errors }) => (
          <li key={file.path}>
            {file.path} - {(file.size / 1000).toFixed(2)} Kbytes
            <ul>
              {errors.map((e) => (
                <li key={e.code}>{e.message}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
};

export default FileUploader;
