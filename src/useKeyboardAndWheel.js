import { useEffect } from "react";

function useKeyboardAndWheel(onKeyDown, onWheel) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      onKeyDown(event);
    };

    const handleWheel = (event) => {
      onWheel(event);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleWheel);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [onKeyDown, onWheel]);
}

export default useKeyboardAndWheel;
