export default function keyboardMove({
  eProp,
  trRef,
  coordinates,
  // setAnnotations,
  onChange,
  metaAltKeyState,
}) {
  eProp.preventDefault();
  const DISTANCE = 0.5;
  const MORE_DISTANCE = 20;
  try {
    if (!trRef.current.nodes()) return;
    if (eProp.key === 'ArrowUp') {
      console.log('tr ref', metaAltKeyState);
      trRef.current.nodes().forEach((item) => {
        const anoObj = coordinates.findIndex(
          (anotObj) => anotObj.id === item.attrs.id
        );
        if (metaAltKeyState) {
          coordinates[anoObj].y -= MORE_DISTANCE;
        } else coordinates[anoObj].y -= DISTANCE;
        // setAnnotations(coordinates);
        onChange(coordinates);
      });
    }
    if (eProp.key === 'ArrowDown') {
      // console.log('arrow down');
      trRef.current.nodes().forEach((item) => {
        const anoObj = coordinates.findIndex(
          (anotObj) => anotObj.id === item.attrs.id
        );
        if (metaAltKeyState) {
          coordinates[anoObj].y += MORE_DISTANCE;
        } else coordinates[anoObj].y += DISTANCE;
        // setAnnotations(coordinates);
        onChange(coordinates);
      });
    }
    if (eProp.key === 'ArrowLeft') {
      trRef.current.nodes().forEach((item) => {
        const anoObj = coordinates.findIndex(
          (anotObj) => anotObj.id === item.attrs.id
        );
        if (metaAltKeyState) {
          coordinates[anoObj].x -= MORE_DISTANCE;
        } else coordinates[anoObj].x -= DISTANCE;
        // setAnnotations(coordinates);
        onChange(coordinates);
      });
    }
    if (eProp.key === 'ArrowRight') {
      trRef.current.nodes().forEach((item) => {
        const anoObj = coordinates.findIndex(
          (anotObj) => anotObj.id === item.attrs.id
        );
        if (metaAltKeyState) {
          coordinates[anoObj].x += MORE_DISTANCE;
        } else coordinates[anoObj].x += DISTANCE;
        // setAnnotations(coordinates);
        onChange(coordinates);
      });
    }
  } catch (err) {
    console.log({ err });
  }
}
