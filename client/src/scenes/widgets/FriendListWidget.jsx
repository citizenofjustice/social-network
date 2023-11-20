import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";

import { fetchFriends } from "API";
import { showMessage } from "state/uiSlice";
import Slider from "components/Slider";
import WidgetWrapper from "components/WidgetWrapper";
import FriendListSlide from "components/FriendListSlide";
import CustomCircularLoading from "components/CustomCircularLoading";

const FriendListWidget = () => {
  const dispatch = useDispatch();
  const { userId } = useParams(); // getting userId form router if exist
  const [idx, setIdx] = useState(0); // declaring state for tracking slider pages
  const token = useSelector((state) => state.auth.token);
  const friends = useSelector((state) => state.auth.user.friends);
  const loggedInUserId = useSelector((state) => state.auth.user._id); // authenticated user id
  const isOneself = loggedInUserId === userId; // checking if current page belongs to authenticated user
  const currentUserId = !!userId ? userId : loggedInUserId;
  const slideСapacity = 4; // setting how much friends fits into one slider page
  const widgetTitle = "Friend List";

  const { palette } = useTheme();
  const dark = palette.neutral.dark;

  // using query hook for fetching friends of user & getting loading and error states
  const { isLoading, isError, data } = useQuery({
    queryKey: ["friends", currentUserId, friends.length], // dependencies of query (refetch on change of user page or amount of friends)
    queryFn: async ({ signal }) => {
      const response = await fetchFriends(
        currentUserId,
        token,
        signal // passing down abort signal for query cancelation
      );
      if (!response.ok) {
        const { error } = await response.json();
        if (error.message) throw new Error(error.message);
        throw new Error(error); // if request failed throw error
      }
      const userFriends = await response.json();
      return Promise.all(userFriends);
    },
    enabled: !!currentUserId, // disabling query in case of a lack of id parameter
  });

  // handle slider page change
  const handleIndexChange = (change) => {
    setIdx((prevIdx) => prevIdx + change);
  };

  // handle slider pages decreacse if user removes a friend
  const handleSlidesDecrease = () => {
    setIdx((prevIdx) => prevIdx - 1);
  };

  // display an error message if fetching failed
  if (isError) {
    dispatch(
      showMessage({
        isShown: true,
        text: "An error occurred while fetching friends",
        type: "error",
      })
    );
  }

  return (
    <WidgetWrapper>
      {!isLoading && !isError ? (
        <>
          {data.length !== 0 ? (
            <Slider
              title={widgetTitle}
              currentIdx={idx}
              chunkSize={slideСapacity}
              itemsCounter={data.length}
              onIndexChange={handleIndexChange}
            >
              <FriendListSlide
                data={data}
                chunkSize={slideСapacity}
                idx={idx}
                onSlidesDecrease={handleSlidesDecrease}
              />
            </Slider>
          ) : (
            <Box>
              <Typography color={dark} variant="h5" fontWeight="500">
                {widgetTitle}
              </Typography>
              {`${isOneself ? "You" : "User"} haven't added any friends.`}
              {isOneself && <br />}
              {isOneself && "Try to find your friends using search."}
            </Box>
          )}
        </>
      ) : (
        <>
          <Typography color={dark} variant="h5" fontWeight="500">
            {widgetTitle}
          </Typography>
          {isLoading && <CustomCircularLoading />}
          {isError && <Typography>Failed to fetch friends</Typography>}
        </>
      )}
    </WidgetWrapper>
  );
};

export default FriendListWidget;
