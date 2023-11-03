import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllPosts, fetchUserPosts } from "API";
import PostWidget from "./PostWidget";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { setPosts, clearPosts } from "state/postsSlice";
import WidgetWrapper from "components/WidgetWrapper";

const PostsWidget = ({ userId, isProfile = false, limit = 10 }) => {
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.token);
  const [pageNum, setPageNum] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const feedIsNotFull = pageNum < totalPageCount;
  const location = useLocation();
  const { posts, reloadToggle } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const getAllPosts = useCallback(async () => {
    setIsPostsLoading(true);
    const { pagesCount, postsPage } = await fetchAllPosts(
      loggedInUserId,
      token,
      limit,
      pageNum
    );
    setTotalPageCount(pagesCount);
    if (postsPage) dispatch(setPosts({ posts: postsPage }));
    setIsPostsLoading(false);
  }, [loggedInUserId, token, pageNum, limit, dispatch]);

  const getUserPosts = useCallback(async () => {
    setIsPostsLoading(true);
    const { pagesCount, postsPage } = await fetchUserPosts(
      userId,
      token,
      limit,
      pageNum
    );
    setTotalPageCount(pagesCount);
    if (postsPage) dispatch(setPosts({ posts: postsPage }));
    setIsPostsLoading(false);
  }, [userId, token, pageNum, limit, dispatch, reloadToggle]);

  useEffect(() => {
    dispatch(clearPosts());
    setPageNum(1);
  }, [dispatch, location.pathname, reloadToggle]);

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getAllPosts();
    }
  }, [getAllPosts, getUserPosts, isProfile]);

  useEffect(() => {
    if (inView && feedIsNotFull) {
      setPageNum((prev) => (prev += 1));
    }
  }, [inView, feedIsNotFull]);

  if (posts.length === 0 && !isPostsLoading)
    return (
      <WidgetWrapper marginTop={isProfile && "2rem"}>
        <Box display="flex" justifyContent="center" pb="0.75rem">
          <Typography fontSize="1rem">
            {isProfile
              ? `${
                  loggedInUserId === userId
                    ? "You have not made post yet, try adding one..."
                    : "User have not made post yet..."
                } `
              : "Feed currently empty..."}
          </Typography>
        </Box>
      </WidgetWrapper>
    );

  return (
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
            name={`${user.firstName} ${user.lastName}`}
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
      <Box display="flex" justifyContent="center">
        {isPostsLoading && <CircularProgress sx={{ marginTop: "2rem" }} />}
      </Box>
      {posts && <div ref={ref}></div>}
    </>
  );
};

export default PostsWidget;
