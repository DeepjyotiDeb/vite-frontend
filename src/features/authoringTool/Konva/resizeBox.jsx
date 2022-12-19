export const copyObjProps = ({ currentObj, setResizeProps, setToast }) => {
  if (currentObj.nodes().length === 1) {
    const { height, width } = currentObj.nodes()[0].attrs;
    setResizeProps({ height, width });
    setToast((prevState) => ({
      ...prevState,
      state: true,
      severity: 'info',
      message: 'Size properties copied',
    }));
  }
};
export const resizeObj = ({
  currentObj,
  resizeProps,
  coordinates,
  onChange,
  setToast,
}) => {
  if (currentObj.nodes().length === 1 && resizeProps.height) {
    let tempObjIndex = coordinates.findIndex(
      (item) => item.id === currentObj.nodes()[0].attrs.id
    );
    coordinates[tempObjIndex].height = resizeProps.height;
    coordinates[tempObjIndex].width = resizeProps.width;
    // setAnnotations(coordinates);
    onChange(coordinates);
    setToast((prevState) => ({
      ...prevState,
      state: true,
      severity: 'success',
      message: 'Size properties pasted',
    }));
  } else {
    setToast((prevState) => ({
      ...prevState,
      state: true,
      severity: 'error',
      message: 'No properties copied',
    }));
  }
};
export const resizeAllObj = ({
  // currentObj,
  resizeProps,
  coordinates,
  onChange,
  setToast,
}) => {
  if (resizeProps.height) {
    // console.log('res all');
    coordinates.forEach((anno, index) => {
      if (index !== 0) {
        anno.height = resizeProps.height;
        anno.width = resizeProps.width;
        // setAnnotations(coordinates);
        onChange(coordinates);
      }
    });
    setToast((prevState) => ({
      ...prevState,
      state: true,
      severity: 'success',
      message: 'Size properties pasted',
    }));
  } else {
    setToast((prevState) => ({
      ...prevState,
      state: true,
      severity: 'error',
      message: 'No properties copied',
    }));
  }
};
