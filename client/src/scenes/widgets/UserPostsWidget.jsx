import { Fragment, useEffect } from "react";
import PostWidget from "./PostWidget";
import WidgetWrapper from "components/WidgetWrapper";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useInfiniteQuery } from "react-query";
import { fetchUserPosts } from "API";
import CustomCircularLoading from "components/CustomCircularLoading";
import { useLocation } from "react-router-dom";
import { showMessage } from "state/uiSlice";
import { useInView } from "react-intersection-observer";

const UserPostsWidget = ({ userId, limit = 10 }) => {
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.token);
  const { ref, inView } = useInView({ threshold: 0.5 });

  const location = useLocation();

  const sendReq = async ({ pageParam = 1 }) => {
    try {
      // Make the API call and return the data
      const response = await fetchUserPosts(userId, token, limit, pageParam);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const fetchedPosts = await response.json();
      return fetchedPosts;
    } catch (error) {
      throw new Error("Request fetching user posts has failed");
    }
  };

  // Infinite query hook
  const { data, error, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["posts", location.pathname],
      queryFn: sendReq,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    });

  // Effect hook to fetch next page when visible
  useEffect(() => {
    // do nothing while ref is not visible, request is fetching or no pages left
    if (!inView || isFetching || !hasNextPage) return () => {};

    const interval = setInterval(() => {
      if (inView) {
        fetchNextPage();
      }
    }, 250);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isFetching]);

  if (status === "error") {
    dispatch(
      showMessage({
        isShown: true,
        text: error.message,
        type: "error",
      })
    );
  }

  return (
    <>
      {data && status !== "error" && status !== "loading" && (
        <>
          {data.pages[0].totalPostCount > 0 ? (
            <>
              {data.pages.map((group, i) => (
                <Fragment key={i}>
                  {group.postsPage.map(
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
                      aspectRatio,
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
                        aspectRatio={aspectRatio}
                      />
                    )
                  )}
                </Fragment>
              ))}
              <div style={{ height: "5px" }} ref={ref}></div>
            </>
          ) : (
            <WidgetWrapper marginTop="1rem">
              <Box display="flex" justifyContent="center" pb="0.75rem">
                {loggedInUserId === userId
                  ? "You have not made post yet, try adding one..."
                  : "User have not made post yet..."}
              </Box>
            </WidgetWrapper>
          )}
        </>
      )}
      {status === "loading" && <CustomCircularLoading margin="2rem 0 0 0" />}
    </>
  );
};

export default UserPostsWidget;
