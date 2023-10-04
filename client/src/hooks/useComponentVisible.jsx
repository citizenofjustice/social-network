import { useState, useEffect, useRef, useCallback } from "react";

export default function useComponentVisible(
  initialIsVisible,
  outsideConfirm = false
) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        // if hook was called with confirm parametr
        if (outsideConfirm) {
          const isCanceled = window.confirm(
            "Are you sure you want to close the window?"
          );
          // if the user cancels an external click, cancel further execution of the function
          if (!isCanceled) return;
        }
        // hide specified component
        setIsComponentVisible(false);
      }
    },
    [outsideConfirm]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  return { ref, isComponentVisible, setIsComponentVisible };
}
