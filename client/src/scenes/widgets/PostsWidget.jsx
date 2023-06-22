import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchAllPosts, fetchUserPosts } from "API";
import PostWidget from "./PostWidget";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Box } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const loggedInUserId = useSelector((state) => state.user._id);
  const [posts, setPosts] = useState([]);
  const token = useSelector((state) => state.token);
  const [pageNum, setPageNum] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const feedIsNotFull = pageNum < totalPageCount;
  const limit = 3;

  const getAllPosts = useCallback(async () => {
    const { pagesCount, postsPage } = await fetchAllPosts(
      loggedInUserId,
      token,
      pageNum,
      limit
    );
    setTotalPageCount(pagesCount);
    if (postsPage) setPosts((prevPosts) => [...prevPosts, ...postsPage]);
  }, [loggedInUserId, token, pageNum]);

  const getUserPosts = useCallback(async () => {
    const { pagesCount, postsPage } = await fetchUserPosts(
      userId,
      token,
      pageNum,
      limit
    );
    setTotalPageCount(pagesCount);
    if (postsPage) setPosts((prevPosts) => [...prevPosts, ...postsPage]);
  }, [userId, token, pageNum]);

  useEffect(() => {
    if (inView && feedIsNotFull) {
      setPageNum((prev) => (prev += 1));
    }
  }, [inView, feedIsNotFull]);

  useEffect(() => {
    setIsPostsLoading(true);
    if (isProfile) {
      getUserPosts();
    } else {
      getAllPosts();
    }
    setIsPostsLoading(false);
  }, [getAllPosts, getUserPosts, isProfile]);

  if (posts.length === 0) return null;

  return (
    <Box>
      {isPostsLoading ? (
        <h1>Loading...</h1>
      ) : (
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
          {posts && (
            <div ref={ref} style={{ height: 20, background: "red" }}></div>
          )}
        </>
      )}
    </Box>
  );
};

export default PostsWidget;
