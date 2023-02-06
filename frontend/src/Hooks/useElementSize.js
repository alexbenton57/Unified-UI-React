import React, { useState, useEffect } from "react";

export default function useElementSize(elementRef) {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [elementSize, setElementSize] = useState({
      width: 0,
      height: 0,
    });
  
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        
        setElementSize({
          width: elementRef.current.clientWidth,
          height: elementRef.current.clientHeight
        });
      }
      // Add event listener
      window.addEventListener("resize", handleResize);
      // Call handler right away so state gets updated with initial window size
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, [elementRef]); // Empty array ensures that effect is only run on mount
  
    return elementSize;
  }