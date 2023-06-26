import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllPosts, fetchUserPosts } from "API";
import PostWidget from "./PostWidget";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Box, CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";
import { setPosts, clearPosts } from "state/postsSlice";

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

  if (posts.length === 0) return null;

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          createdAt,
          updatedAt,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
          isEdited,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            createdAt={createdAt}
            updatedAt={updatedAt}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            isEdited={isEdited}
          />
        )
      )}
      <Box display="flex" justifyContent="center">
        {isPostsLoading && <CircularProgress />}
      </Box>
      {posts && <div ref={ref}></div>}
    </>
  );
};

export default PostsWidget;
