/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Group, Layer, Rect, Stage, Text, Transformer } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';

import keyboardMove from './keyboardMove';
import { RemoveShape } from './RemoveShape';
import { copyObjProps, resizeAllObj, resizeObj } from './resizeBox';
import UrlImageViewer from './UrlImageViewer';
import { useKeyPress, useKeyUp } from './useKey';
import { CustomSnackbar } from '../../../elements/CustomSnackBar';

const Rectangle = ({
  shapeProps,
  onSelect,
  onChange,
  draw,
  // coordinates,
  handleDelete,
  // index,
  // dragState,
  // setDragState,
}) => {
  const shapeRef = useRef();

  const [toolVisible, setToolVisible] = useState(true);
  const [color, setColor] = useState({
    labelColor: '#000',
    fillColor: '#00000014',
  });

  useEffect(() => {
    if (shapeProps.type === 'Name' || shapeProps.type === 'Number') {
      setColor({ labelColor: '#003cff', fillColor: '#0004ff13' });
    }
    if (shapeProps.type === 'Q') {
      setColor({ labelColor: '#ff0000', fillColor: '#ff000010' });
    }
    if (shapeProps.type.includes('A')) {
      setColor({ labelColor: '#000', fillColor: '#00000014' });
    }
  }, [shapeProps.type]);

  const RETURN_KEY = 13;
  const ESCAPE_KEY = 27;

  function handleEscapeKeys(e) {
    if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
      //   onToggleEdit(e);
    }
  }

  function handleTextChange(e) {
    onChange(e.currentTarget.value);
  }

  return (
    <Group
      visible={
        (Math.abs(shapeProps.width) || Math.abs(shapeProps.height)) < 2
          ? false
          : true
      }
      id={`${shapeProps.id}`}
      onClick={(e) => console.log('e', e)}
    >
      <Text
        id='rectlabel'
        onClick={(e) => console.log('e', e)}
        fill={color.labelColor}
        text={shapeProps.type}
        stroke={color.labelColor}
        strokeWidth={1}
        fontSize={13}
        x={shapeProps.x}
        y={shapeProps.y + shapeProps.height / 2 - 10}
        visible={toolVisible}
        height={shapeProps.height}
        width={shapeProps.width}
        align='center'
      />
      {/* <Html
        groupProps={{ x: 200, y: 200 }}
        divProps={{ style: { opacity: 0 } }}
      >
        <textarea
          value=''
          onChange={handleTextChange}
          onKeyDown={handleEscapeKeys}
          //   style={style}
        />
      </Html> */}
      <RemoveShape
        x={shapeProps.x + shapeProps.width}
        y={shapeProps.y - 12}
        onClick={handleDelete}
        // label={shapeProps.type}
        label={shapeProps.type}
        // draw={draw}
        // setDraw={setDraw}
        visible={toolVisible}
      />
      <Rect
        // perfectDrawEnabled={false}
        onClick={() => {
          onSelect(shapeRef);
        }}
        onTap={() => onSelect(shapeRef)}
        ref={shapeRef}
        {...shapeProps}
        name='rectangle'
        cornerRadius={2}
        stroke={color.labelColor}
        fill={color.fillColor}
        draggable={draw === true ? true : false}
        // onDragStart={() => {
        // console.log('dragState', dragState);
        // setDragState(true);
        // }}
        onDragMove={() => {
          // setCoords((prevState) => ({
          //   ...prevState,
          //   xPos: e.target.x(),
          //   yPos: e.target.y(),
          // }));
          setToolVisible(false);
          // console.log('dragState', dragState);
        }}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
          // setCoords((prevState) => ({
          //   ...prevState,
          //   xPos: e.target.x(),
          //   yPos: e.target.y(),
          // }));
          setToolVisible(true);
          // console.log('drag end', dragState);
        }}
        onTransformStart={() => {
          setToolVisible(false);
        }}
        onTransformEnd={() => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
          // setCoords({
          //   xPos: node.x(),
          //   yPos: node.y(),
          //   Cwidth: Math.max(5, node.width() * scaleX),
          //   Cheight: Math.max(node.height() * scaleY),
          // });
          setToolVisible(true);
        }}
      />
    </Group>
  );
};

export const KonvaCropper = ({
  stageHeight,
  stageWidth,
  imgSrc,
  coordinates,
  onChange,
  // onDelete,
  metaData,
  editState,
  setState,
  // handleEdit,
  contentType,
  contentSubType,
  clearScreen,
  addQuestion,
}) => {
  // const [coordinates, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  // const [rectLabel, setRectLabel] = useState('Q');
  const [nodesArray, setNodes] = useState([]);

  const [resizeProps, setResizeProps] = useState({ height: 0, width: 0 });
  const [toast, setToast] = useState({
    state: false,
    severity: 'success',
    message: '',
    positionVertical: 'bottom',
    positionHorizontal: 'center',
  });

  const [selectedId, selectShape] = useState(null);

  const [shiftKeyDown, setShiftKeyDown] = useState(false);
  const [metaAltKey, setMetaAltKey] = useState(false);

  const msTapState = useRef(false);
  const trRef = useRef();
  const layerRef = useRef();
  const oldPos = useRef(null);
  const Konva = window.Konva;
  const selectionRectRef = useRef();
  const selection = useRef({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  //* useEffect hooks

  // if subtypes of name or number and objects are selected,
  // the following hook will clear the selections
  useEffect(() => {
    if (contentSubType === 'name' || contentSubType === 'number')
      removeObjects();
    if (clearScreen) {
      removeObjects();
      setState((prevState) => ({ ...prevState, clearScreen: false }));
    }
  }, [contentSubType, clearScreen]);

  //hook sets the coordinates of the previous questions on screen
  useEffect(() => {
    if (metaData && editState) {
      const tempMetaData = [...metaData.qbox, ...metaData.ansBox];
      console.log('coords', coordinates);
      coordinates.splice(0);
      setNodes([]);
      if (coordinates.length === 0) {
        tempMetaData.forEach((annotation, index) => {
          if (metaData.contentType === 'studentInfo' && index !== 1) return;
          // console.log('meta', annotation);
          const typeLabel = getLabel(metaData.contentSubType);
          const annotationToAdd = {
            x: annotation.x,
            y: annotation.y,
            width: annotation.w,
            height: annotation.h,
            id: uuidv4(),
            type:
              metaData.contentType === 'studentInfo'
                ? typeLabel
                : coordinates.length === 0
                ? 'Q'
                : `A${coordinates.length}`,
          };
          coordinates.push(annotationToAdd);
          // setAnnotations(coordinates);
          onChange(coordinates);
          setState((prevState) => ({
            ...prevState,
            editState: false,
          }));
        });
      }
    }
  }, [editState]);

  //* keyboard functions
  const copy = (e) => {
    console.log({ coordinates });
    if (e.key === 'd') {
      // console.log('copy', trRef.current.nodes());
      try {
        if (trRef.current.nodes().length !== 0) {
          const tempCopy =
            trRef.current.nodes()[trRef.current.nodes().length - 1];
          // console.log({ tempCopy, trRef });
          const copyButton = document.querySelector('#toolBar');
          const toolBarY =
            window.scrollY + copyButton.getBoundingClientRect().top;
          const toolBarX =
            window.scrollX + copyButton.getBoundingClientRect().left;
          // console.log('toolbar pos', toolBarX, toolBarY);
          const annotationToAdd = {
            x: toolBarX - 150,
            y: toolBarY + 50,
            width: tempCopy.attrs.width,
            height: tempCopy.attrs.height,
            id: uuidv4(),
            type: coordinates.length === 0 ? 'Q' : `A${coordinates.length}`,
          };
          updateAnnotations(annotationToAdd);
        }
      } catch (error) {
        console.log({ error });
      }
    }
  };

  const removeObjects = () => {
    // setAnnotations([]);
    setNodes([]);
    onChange([]);
    if (trRef.current.nodes().length > 0) trRef.current.nodes([]);
  };

  const resizeFunction = (eventKey) => {
    eventKey === 'f'
      ? copyObjProps({
          currentObj: trRef.current,
          setResizeProps: setResizeProps,
          setToast: setToast,
        })
      : eventKey === 'g'
      ? resizeObj({
          coordinates: coordinates,
          currentObj: trRef.current,
          onChange: onChange,
          resizeProps: resizeProps,
          setToast: setToast,
        })
      : eventKey === 'h'
      ? resizeAllObj({
          coordinates: coordinates,
          // currentObj: trRef.current,
          onChange: onChange,
          resizeProps: resizeProps,
          setToast: setToast,
        })
      : console.log();
  };

  const mStage = document.querySelector('.MainStage');
  // console.log('mstage', mStage);
  useKeyPress(['f', 'g', 'h'], (e) => resizeFunction(e.key), mStage);

  useKeyPress(['Shift'], () => setShiftKeyDown(true), mStage);
  useKeyUp(['Shift'], () => setShiftKeyDown(false), mStage);

  useKeyPress(
    ['Meta', 'Alt'],
    (e) => {
      e.preventDefault();
      setMetaAltKey(true);
    },
    mStage
  );
  useKeyUp(
    ['Meta', 'Alt'],
    (e) => {
      e.preventDefault();
      setMetaAltKey(false);
    },
    mStage
  );

  useKeyPress(['r'], removeObjects, mStage);
  useKeyPress(['d'], copy, mStage);

  useKeyPress(
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
    (e) =>
      keyboardMove({
        eProp: e,
        coordinates: coordinates,
        // setAnnotations: setAnnotations,
        onChange: onChange,
        trRef: trRef,
        metaAltKeyState: metaAltKey,
      }),
    mStage
  );

  //* Button functions
  const handleDelete = (e) => {
    const groupId = e.target.parent.attrs.id;
    let annoIndex = coordinates.findIndex((item) => item.id === groupId);
    // let annotatIndex = coordinates.findIndex((item) => item.id === groupId);
    const container = e.target.getStage().container();
    container.style.cursor = 'default';
    if (trRef.current.nodes().length > 0) trRef.current.nodes([]); //clear selections if there are any on screen
    coordinates.splice(annoIndex, 1);
    coordinates.forEach((item, index) => {
      const typeLabel = getLabel(contentSubType);
      if (index >= annoIndex) {
        // if (index !== 0) {
        // const newLabel = index === 0 ? 'Q' : `A${index}`;
        item.type =
          contentType === 'studentInfo'
            ? typeLabel
            : index === 0
            ? 'Q'
            : `A${index}`;
        // }
      }
    });
    // setAnnotations(coordinates);
    onChange(coordinates);
    setNodes([]);
    // console.log({ annoIndex });
  };

  //* Helper methods used in other functions
  const getLabel = (type) => {
    switch (type) {
      case 'name':
        return 'Name';
      case 'number':
        return 'Number';
      default:
        break;
    }
  };
  //creates the selection area of the rectangle
  const updateSelectionRect = () => {
    const node = selectionRectRef.current;
    node.setAttrs({
      visible: selection.current.visible,
      x: Math.min(selection.current.x1, selection.current.x2),
      y: Math.min(selection.current.y1, selection.current.y2),
      width: Math.abs(selection.current.x1 - selection.current.x2),
      height: Math.abs(selection.current.y1 - selection.current.y2),
      fill: 'rgba(0, 161, 255, 0.3)',
    });
    node.getLayer().batchDraw();
  };

  const updateAnnotations = (annotationToAdd) => {
    // console.log({ annotationToAdd });
    coordinates.push(annotationToAdd);
    // setAnnotations(coordinates);
    onChange(coordinates);
  };

  //   const mouseUpHelper = () => {
  //     if (!selection.current.visible) {
  //       return;
  //     }
  //     const selBox = selectionRectRef.current.getClientRect();
  //     let elements = [];
  //     layerRef.current.find('.rectangle').forEach((elementNode) => {
  //       const elBox = elementNode.getClientRect();
  //       if (Konva.Util.haveIntersection(selBox, elBox)) {
  //         elements.push(elementNode);
  //       }
  //     });
  //     try {
  //       // console.log('try block', trRef.current.nodes(), elements);
  //       trRef.current.nodes([...elements]);
  //     } catch (error) {
  //       console.log('error', error);
  //     }
  //     selection.current.visible = false;
  //     Konva.listenClickTap = false;
  //     // setDragState(false);
  //     updateSelectionRect();
  //   };

  //* Mouse events section
  //has 2 jobs to do: 1. get x and y coord 2. update the selection?
  const onMouseDown = (e) => {
    msTapState.current = true;
    // console.log("mouse down, tap", msTapState.current);
    if (shiftKeyDown) {
      const isElement = e.target.findAncestor('.elements-container');
      const isTransformer = e.target.findAncestor('Transformer');
      if (isElement || isTransformer) {
        console.log('failed mouse down');
        return;
      }
      const pos = e.target.getStage().getPointerPosition();
      selection.current.visible = true;
      selection.current.x1 = pos.x;
      selection.current.y1 = pos.y;
      selection.current.x2 = pos.x;
      selection.current.y2 = pos.y;
      updateSelectionRect();
    }
    if (trRef.current.nodes().length === 0 && shiftKeyDown === false) {
      // setMsTap(true);
      // if (draw) {
      if (newAnnotation.length === 0) {
        const { x, y } = e.target.getStage().getPointerPosition();
        const typeLabel = getLabel(contentSubType);
        const temp = coordinates.filter((item) =>
          item.type.includes('A')
        ).length;
        console.log(
          coordinates,
          !coordinates.some((item) => item.type.includes('Q'))
        );
        setNewAnnotation([
          {
            x,
            y,
            width: 0,
            height: 0,
            id: '0',
            type:
              contentType === 'studentInfo'
                ? typeLabel
                : addQuestion === true &&
                  !coordinates.some((item) => item.type.includes('Q'))
                ? 'Q'
                : `A${temp + 1}`,
          },
        ]);
      }
    }
  };

  //update pointer coords as it moves whether selecting or drawing
  const onMouseMove = (e) => {
    if (shiftKeyDown) {
      if (!selection.current.visible) {
        // console.log('failed mouse move');
        return;
      }
      const pos = e.target.getStage().getPointerPosition();
      selection.current.x2 = pos.x;
      selection.current.y2 = pos.y;
      updateSelectionRect();
      // setSelect(true); // need to set this
    }
    if (trRef.current.nodes().length === 0 && shiftKeyDown === false) {
      msTapState.current = false; //to prevent object from beiing selected after drawing
      // console.log("ms move, tap", msTapState.current);
      // setMsTap(false);
      if (newAnnotation.length === 1) {
        const sx = newAnnotation[0].x;
        const sy = newAnnotation[0].y;
        const { x, y } = e.target.getStage().getPointerPosition();
        if (x - sx < 0 || y - sy < 0) {
          setNewAnnotation([]);
          return;
        }
        // console.log('mouse move props', e);
        setNewAnnotation([
          {
            x: sx,
            y: sy,
            width: x - sx,
            height: y - sy,
            id: '0',
            type: newAnnotation[0].type,
          },
        ]);
      }
    }
  };

  //finalise the selections OR the drawn object
  const onMouseUp = (e) => {
    // if (draw === false) {
    if (shiftKeyDown === true) {
      // console.log('newAnnot ms up', newAnnotation);
      oldPos.current = null;
      if (!selection.current.visible) {
        return;
      }
      const selBox = selectionRectRef.current.getClientRect();
      let elements = [];
      layerRef.current.find('.rectangle').forEach((elementNode) => {
        const elBox = elementNode.getClientRect();
        if (Konva.Util.haveIntersection(selBox, elBox)) {
          elements.push(elementNode);
        }
      });
      try {
        // console.log('try block', trRef.current.nodes(), elements);
        trRef.current.nodes([...elements]);
      } catch (error) {
        console.log('error', error);
      }
      selection.current.visible = false;
      Konva.listenClickTap = false;
      // setDragState(false);
      updateSelectionRect();
      return;
    }
    if (trRef.current.nodes().length === 0 && shiftKeyDown === false) {
      if (newAnnotation.length === 1) {
        const sx = newAnnotation[0].x;
        const sy = newAnnotation[0].y;
        const { x, y } = e.target.getStage().getPointerPosition();
        if (Math.abs(x - sx) < 2 || Math.abs(y - sy) < 2) {
          setNewAnnotation([]);
          return;
        }
        const annotationToAdd = {
          x: x - sx < 0 ? x : sx,
          y: y - sy < 0 ? y : sy,
          width: Math.abs(x - sx),
          height: Math.abs(y - sy),
          id: uuidv4(),
          type: newAnnotation[0].type,
        };
        updateAnnotations(annotationToAdd);
        setNewAnnotation([]);
      }
    }
  };

  const onClickTap = (e) => {
    if (!shiftKeyDown && msTapState.current) {
      let stage = e.target.getStage();
      let layer = layerRef.current;
      let tr = trRef.current;
      // if click on empty area - remove all selections
      // console.log("target attrs", e.target.attrs.id);
      if (e.target === stage || e.target.attrs.id === 'removeImg') {
        selectShape(null);
        setNodes([]);
        tr.nodes([]);
        layer.draw();
        // console.log("tap deselect", tr.nodes());
        return;
      }

      // do nothing if clicked NOT on our rectangles
      if (e.target.hasName('.rect')) {
        // console.log('rect');
        return;
      }

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.ctrlKey || e.evt.metaKey || e.evt.altKey;
      const isSelected = tr.nodes().indexOf(e.target) >= 0;
      if (
        !metaPressed &&
        !isSelected &&
        e.target.attrs.id !== 'removeImg' &&
        e.target.parent.attrs.name !== 'transformerBoxes'
      ) {
        // if no key pressed and the node is not selected
        // select just one
        tr.nodes([e.target]);
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const nodes = tr.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        nodes.splice(nodes.indexOf(e.target), 1);
        tr.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = tr.nodes().concat([e.target]);
        tr.nodes(nodes);
      }
      layer.draw();
      msTapState.current = false;
    }
  };

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.currentTarget.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
      trRef.current.nodes([]);
      setNodes([]);
      // layerRef.current.remove(selectionRectangle);
    }
  };

  const stageRef = useRef(null);
  const scaleBy = 1.01;
  function zoomStage(event) {
    event.evt.preventDefault();
    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale =
        event.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    }
  }

  const coordinatesToDraw = [...coordinates, ...newAnnotation];

  return (
    <div
      tabIndex={1}
      className='MainStage'
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <Stage
        width={stageWidth + 1000}
        height={stageHeight + 1000}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={onClickTap}
        onWheel={zoomStage}
        ref={stageRef}
        onDblClick={checkDeselect}
        onMouseEnter={(e) => {
          // style stage container:
          const container = e.target.getStage().container();
          container.style.cursor = 'crosshair';
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage().container();
          container.style.cursor = 'default';
        }}

        //* mobile controls
        // onTouchStart={onMouseDown}
        // onTouchMove={onMouseMove}
        // onTouchEnd={onMouseUp}
        // onTap={onClickTap}
        // onDblTap={checkDeselect}
        // onTouchStart={checkDeselect}
        // onTap={onClickTap}
      >
        <Layer id='UrlImage' listening={false}>
          <UrlImageViewer
            urlImage={imgSrc}
            x={0}
            y={0}
            imageHeight={stageHeight}
            imageWidth={stageWidth}
          />
        </Layer>
        <Layer ref={layerRef}>
          {coordinatesToDraw.map((rect, i) => {
            return (
              <Rectangle
                key={i}
                index={i}
                handleDelete={handleDelete}
                getKey={i}
                shapeProps={rect}
                draw={trRef.current.nodes().length !== 0}
                // draw={draw}
                // setDragState={setDragState}
                // coordinates={coordinates}
                contentType={contentType}
                isSelected={rect.id === selectedId}
                getLength={coordinates.length}
                onSelect={(e) => {
                  if (
                    e.current !== undefined &&
                    shiftKeyDown
                    // draw === false &&
                  ) {
                    try {
                      let temp = nodesArray;
                      if (!nodesArray.includes(e.current)) temp.push(e.current);
                      setNodes(temp);
                      trRef.current.nodes(nodesArray);
                      // trRef.current.nodes(nodesArray);
                      trRef.current.getLayer().batchDraw();
                    } catch (error) {
                      console.log('error', error);
                    }
                  }
                  selectShape(rect.id);
                }}
                onChange={(newAttrs) => {
                  coordinates[i] = newAttrs;
                  // setAnnotations(coordinates);
                  onChange(coordinates);
                  // console.log(rects, coordinates);
                }}
              />
            );
          })}
          <Transformer
            name='transformerBoxes'
            rotateEnabled={false}
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
          <Rect fill='rgba(0,0,255,0.5)' ref={selectionRectRef} />
        </Layer>
      </Stage>
      <CustomSnackbar toast={toast} setToast={setToast} />
    </div>
  );
};
