import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('sm');

  function toggle() {
    setIsShowing(!isShowing);
  }

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  return {
    isShowing,
    toggle,
    maxWidth,
    handleMaxWidthChange,
    fullWidth,
    handleFullWidthChange,
  };
};

export default useModal;
