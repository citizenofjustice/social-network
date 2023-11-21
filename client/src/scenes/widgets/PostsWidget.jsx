import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllPosts, fetchUserPosts } from "API";
import PostWidget from "./PostWidget";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { setPosts, clearPosts } from "state/postsSlice";
import WidgetWrapper from "components/WidgetWrapper";
import CustomCircularLoading from "components/CustomCircularLoading";
import { useMutation, useQuery, useQueryClient } from "react-query";

const PostsWidget = ({ userId, isProfile = false, limit = 10 }) => {
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.token);
  const [pageNum, setPageNum] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(2);
  // const [isPostsLoading, setIsPostsLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const feedIsNotFull = pageNum < totalPageCount;
  // const location = useLocation();
  // const { posts /*, reloadToggle*/ } = useSelector((state) => state.posts);
  const [posts, setPosts] = useState([]);

  // const getAllPosts = useCallback(
  //   async (signal) => {
  //     setIsPostsLoading(true);
  //     const { pagesCount, postsPage } = await fetchAllPosts(
  //       loggedInUserId,
  //       token,
  //       limit,
  //       pageNum,
  //       signal
  //     );
  //     setTotalPageCount(pagesCount);
  //     if (postsPage) dispatch(setPosts({ posts: postsPage }));
  //     setIsPostsLoading(false);
  //   },
  //   [loggedInUserId, token, pageNum, limit, dispatch]
  // );

  // const getUserPosts = useCallback(
  //   async (signal) => {
  //     setIsPostsLoading(true);
  //     const { pagesCount, postsPage } = await fetchUserPosts(
  //       userId,
  //       token,
  //       limit,
  //       pageNum,
  //       signal
  //     );
  //     setTotalPageCount(pagesCount);
  //     if (postsPage) dispatch(setPosts({ posts: postsPage }));
  //     setIsPostsLoading(false);
  //   },
  //   [userId, token, pageNum, limit, dispatch, reloadToggle]
  // );

  // useEffect(() => {
  //   dispatch(clearPosts());
  //   setPageNum(1);
  // }, [dispatch, location.pathname, reloadToggle]);

  // useEffect(() => {
  //   const abortController = new AbortController();
  //   if (isProfile) {
  //     getUserPosts(abortController.signal);
  //   } else {
  //     getAllPosts(abortController.signal);
  //   }
  //   return () => {
  //     abortController.abort();
  //   };
  // }, [getAllPosts, getUserPosts, isProfile]);

  useEffect(() => {
    if (inView && feedIsNotFull) {
      setPageNum((prev) => (prev += 1));
    }
  }, [inView, feedIsNotFull]);

  // if (posts.length === 0 && !isPostsLoading)
  //   return (
  //     <WidgetWrapper marginTop={isProfile && "1rem"}>
  //       <Box display="flex" justifyContent="center" pb="0.75rem">
  //         <Typography fontSize="1rem">
  //           {isProfile
  //             ? `${
  //                 loggedInUserId === userId
  //                   ? "You have not made post yet, try adding one..."
  //                   : "User have not made post yet..."
  //               } `
  //             : "Feed currently empty..."}
  //         </Typography>
  //       </Box>
  //     </WidgetWrapper>
  //   );

  const { isLoading, isError, data } = useQuery({
    queryKey: ["posts", loggedInUserId, pageNum],
    queryFn: async ({ signal }) => {
      const response = await fetchAllPosts(
        loggedInUserId,
        token,
        limit,
        pageNum,
        signal
      );
      if (!response.ok) {
        const { error } = await response.json();
        if (error.message) throw new Error(error.message);
        throw new Error(error); // if request failed throw error
      }
      const fetchedPosts = await response.json();
      const { pagesCount, postsPage } = fetchedPosts;
      setTotalPageCount(pagesCount);
      // setPosts((prevPosts) => [...prevPosts, ...postsPage]);

      // if (postsPage) dispatch(setPosts({ posts: postsPage }));
      return Promise.all(postsPage);
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // if (isLoading) return <Typography>LOADING</Typography>;
  if (isError) return <Typography>ERROR</Typography>;
  // console.log(data);
  return (
    <>
      {!isLoading && !isError && (
        <>
          {data.map(
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
          {posts && <div ref={ref}></div>}
        </>
      )}
      {isLoading && <CustomCircularLoading margin="2rem 0 0 0" />}
    </>
  );
};

export default PostsWidget;
