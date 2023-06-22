import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { fetchAllPosts, fetchUserPosts } from "API";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getAllPosts = useCallback(async () => {
    const allPostsData = await fetchAllPosts(token);
    dispatch(setPosts({ posts: allPostsData }));
  }, [dispatch, token]);

  const getUserPosts = useCallback(async () => {
    const userPostsData = await fetchUserPosts(userId, token);
    dispatch(setPosts({ posts: userPostsData }));
  }, [dispatch, userId, token]);

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getAllPosts();
    }
  }, [isProfile, getUserPosts, getAllPosts]);

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
    </>
  );
};

export default PostsWidget;
