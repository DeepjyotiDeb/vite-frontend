import { useEffect, useState } from 'react';
import { Image } from 'react-konva';

const UrlImageViewer = (props) => {
  const { urlImage, imageWidth, imageHeight, x, y } = props;
  const [imageProps, setImageProps] = useState({
    imageSrc: null,
    // width: 920,
    // height: 1280,
  });

  useEffect(() => {
    const image = new window.Image();
    image.src = urlImage;
    setImageProps((prevState) => ({
      ...prevState,
      imageSrc: image,
    }));
  }, [urlImage]);

  return (
    <Image
      x={x}
      y={y}
      image={imageProps.imageSrc}
      width={imageWidth}
      height={imageHeight}
    />
  );
};

export default UrlImageViewer;
