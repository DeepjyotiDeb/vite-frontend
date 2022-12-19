import { Image } from 'react-konva';
import useImage from 'use-image';

import removeIconBlack from './../../../Assets/removeBlack.png';
import removeIconBlue from './../../../Assets/removeBlue.png';
import removeIconRed from './../../../Assets/removeRed.png';

export const RemoveShape = ({ x, y, onClick, visible, boxType }) => {
  // const [removeImage] = useImage(removeIcon);
  const [removeImage] = useImage(
    boxType === 'studentInfo'
      ? removeIconBlue
      : boxType === 'question'
      ? removeIconRed
      : removeIconBlack
  );
  return (
    <Image
      id='removeImg'
      image={removeImage}
      width={20}
      height={20}
      x={x}
      y={y}
      onClick={onClick}
      visible={visible}
      onMouseEnter={(e) => {
        // style stage container:
        const container = e.target.getStage().container();
        container.style.cursor = 'pointer';
        // setDraw(false);
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage().container();
        container.style.cursor = 'default';
        // setDraw(true);
      }}
    />
  );
};
