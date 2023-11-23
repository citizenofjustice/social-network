import { useEffect, useMemo, useState } from "react";
import PostWidget from "./PostWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { fetchUserPosts } from "API";
import CustomCircularLoading from "components/CustomCircularLoading";
import { useLocation } from "react-router-dom";
import useLoadNextBatch from "hooks/useLoadNextBatch";
import { showMessage } from "state/uiSlice";

const UserPostsWidget = ({ userId, limit = 10 }) => {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.token);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const { ref, pageNum } = useLoadNextBatch(totalPageCount);

  const location = useLocation();

  const currentTimestamp = useMemo(() => {
    const timestamp = Date.now();
    return timestamp;
  }, []);

  const { isLoading, isError, error } = useQuery({
    queryKey: ["posts", pageNum],
    queryFn: async ({ signal }) => {
      const response = await fetchUserPosts(
        userId,
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

  useEffect(() => {
    setPosts([]);
  }, [location.pathname]);

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
      <WidgetWrapper marginTop="1rem">
        <Box display="flex" justifyContent="center" pb="0.75rem">
          <Typography fontSize="1rem">
            {loggedInUserId === userId
              ? "You have not made post yet, try adding one..."
              : "User have not made post yet..."}
          </Typography>
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
      {!isLoading && posts && <div ref={ref}></div>}
    </>
  );
};

export default UserPostsWidget;
