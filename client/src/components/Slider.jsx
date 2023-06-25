import React, { useRef, useState } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

import "./Slider.css";
import Friend from "./Friend";
import FlexBetween from "./FlexBetween";

const Slider = ({ list, chunkSize, isContentLoading }) => {
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState(true);
  const [isLeftToRight, setIsLeftToRight] = useState(true); // direction of animation
  const outRef = useRef(null);
  const inRef = useRef(null);
  const nodeRef = state ? outRef : inRef;

  // dividing list of friends into chunks
  const slides = list.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  const previousSlide = () => {
    setIsLeftToRight(true);
    setState((state) => !state);
    setIdx((prevIdx) => {
      if (prevIdx === 0) return slides.length - 1;
      return prevIdx - 1;
    });
  };

  const nextSlide = () => {
    setIsLeftToRight(false);
    setState((state) => !state);
    setIdx((prevIdx) => {
      if (prevIdx === slides.length - 1) return 0;
      return prevIdx + 1;
    });
  };

  // correcting index in case of deleting a friend
  if (slides.length === idx) {
    setIdx((prevIdx) => prevIdx - 1);
  }

  if (slides.length === idx || slides[idx].length === 0) return null;

  return (
    <>
      <FlexBetween>
        {slides.length > 1 && (
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
          addEndListener={(done) => {
            nodeRef.current.addEventListener("transitionend", done, false);
          }}
          classNames={isLeftToRight ? "left-to-rigth" : "rigth-to-left"}
        >
          <Box m="0.5rem 0" ref={nodeRef} className="slide-container">
            {slides[idx].map((friend) => (
              <Box
                key={friend._id}
                display="flex"
                flexDirection="column"
                gap="1.5rem"
                p="0.75rem 0"
              >
                <Friend
                  friendId={friend._id}
                  name={`${friend.firstName} ${friend.lastName}`}
                  subtitle={friend.occupation}
                  userPicturePath={friend.picturePath}
                  className="friend"
                  isContentLoading={isContentLoading}
                />
              </Box>
            ))}
          </Box>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};

export default Slider;
