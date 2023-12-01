import { Box } from "@mui/material";

import Friend from "./Friend";
import "./Slider.css";

/* Component for splitting friends list into separate slides */
const FriendListSlide = ({ data, chunkSize, idx, onSlidesDecrease }) => {
  // dividing list of friends into chunks for slides
  const slides = data?.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return (
    <>
      {slides.length > 0 &&
        slides[idx].map((friend) => (
          <Box
            key={friend._id}
            display="flex"
            flexDirection="column"
            gap="1.5rem"
            p="0.75rem 0"
          >
            <Friend
              friendId={friend._id}
              firstName={friend.firstName}
              lastName={friend.lastName}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
              className="friend"
            />
          </Box>
        ))}
    </>
  );
};

export default FriendListSlide;
