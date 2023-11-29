import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "API";
import PostWidget from "./PostWidget";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import CustomCircularLoading from "components/CustomCircularLoading";
import { useQuery } from "react-query";
import useLoadNextBatch from "hooks/useLoadNextBatch";
import { showMessage } from "state/uiSlice";

const FeedWidget = ({ limit = 10 }) => {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.token);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const { ref, pageNum } = useLoadNextBatch(totalPageCount);

  const currentTimestamp = useMemo(() => {
    const timestamp = Date.now();
    return timestamp;
  }, []);

  const { isLoading, isError, error } = useQuery({
    queryKey: ["posts", pageNum],
    queryFn: async ({ signal }) => {
      const response = await fetchAllPosts(
        loggedInUserId,
        token,
        currentTimestamp,
        limit,
        pageNum,
        signal
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message); // if request failed throw error
      }
      const fetchedPosts = await response.json();
      const { pagesCount, postsPage } = fetchedPosts;
      setTotalPageCount(pagesCount);
      setPosts((prevPosts) => [...prevPosts, ...postsPage]);
      return Promise.all(postsPage);
    },
    refetchOnWindowFocus: false,
  });

  if (isError) {
    dispatch(
      showMessage({
        isShown: true,
        text: error.message,
        type: "error",
      })
    );
  }

  if (posts.length === 0 && !isLoading && !isError)
    return (
      <WidgetWrapper>
        <Box display="flex" justifyContent="center" pb="0.75rem">
          <Typography fontSize="1rem">Feed currently empty...</Typography>
        </Box>
      </WidgetWrapper>
    );

  return (
    <>
      {!isError && (
        <>
          {posts.map(
            ({
              _id,
              user,
              createdAt,
              updatedAt,
              description,
              picturePath,
              likes,
              comments,
              isEdited,
            }) => (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={user._id}
                createdAt={createdAt}
                updatedAt={updatedAt}
                firstName={user.firstName}
                lastName={user.lastName}
                description={description}
                location={user.location}
                picturePath={picturePath}
                userPicturePath={user.picturePath}
                likes={likes}
                comments={comments}
                isEdited={isEdited}
              />
            )
          )}
        </>
      )}
      {isLoading && <CustomCircularLoading margin="2rem 0 0 0" />}
      {!isLoading && posts && <div style={{ height: "5px" }} ref={ref}></div>}
    </>
  );
};

export default FeedWidget;
