import { useRef, useState } from "react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import FlexBetween from "./FlexBetween";
import "./Slider.css";

/* Slider component for animated transitions */
const Slider = ({
  title,
  currentIdx,
  chunkSize,
  itemsCounter,
  onIndexChange,
  children,
}) => {
  const [state, setState] = useState(true);
  const [isLeftToRight, setIsLeftToRight] = useState(true); // direction of animation
  const outRef = useRef(null);
  const inRef = useRef(null);
  const nodeRef = state ? outRef : inRef;
  const lastSlideIndex = Math.ceil(itemsCounter / chunkSize) - 1; // calculate index of the last slide

  const { palette } = useTheme();
  const dark = palette.neutral.dark;

  // transition to previous slide
  const previousSlide = () => {
    // if current slide is not first
    if (currentIdx > 0) {
      setIsLeftToRight(true); // set animation direction
      setState((state) => !state);
      onIndexChange(-1);
    }
  };

  // transition to next slide
  const nextSlide = () => {
    if (lastSlideIndex === currentIdx) return; // if current slide is last return void
    setIsLeftToRight(false); // set animation direction
    setState((state) => !state);
    onIndexChange(1);
  };

  return (
    <>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          {title}
        </Typography>
        {lastSlideIndex > 0 && ( // slider controls only display if slide amount is more than one
          <Box>
            <IconButton
              size="small"
              onClick={previousSlide}
              style={{ marginRight: "0.5rem" }}
            >
              <ArrowBack />
            </IconButton>
            <IconButton size="small" onClick={nextSlide}>
              <ArrowForward />
            </IconButton>
          </Box>
        )}
      </FlexBetween>
      <SwitchTransition mode={"out-in"}>
        <CSSTransition
          key={state}
          nodeRef={nodeRef}
          timeout={400}
          addEndListener={(done) => {
            nodeRef.current.addEventListener("transitionend", done, false);
          }}
          classNames={isLeftToRight ? "left-to-rigth" : "rigth-to-left"}
        >
          <Box
            m="0.5rem 0"
            ref={nodeRef}
            className="slide-container"
            overflow="hidden"
          >
            {children}
          </Box>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};

export default Slider;
