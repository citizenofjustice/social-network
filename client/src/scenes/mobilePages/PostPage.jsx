import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { fetchСertainPost } from "API";
import PostWidget from "scenes/widgets/PostWidget";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

const PostPage = () => {
  const token = useSelector((state) => state.auth.token);
  const [postData, setPostData] = useState();
  const location = useLocation();

  const getPostData = useCallback(async () => {
    const query = new URLSearchParams(location.search);
    const postId = query.get("id");
    const result = await fetchСertainPost(postId, token);
    if (result) setPostData(result);
  }, [token, location]);

  useEffect(() => {
    getPostData();
  }, [getPostData]);

  if (!postData) return <CircularProgress />;
  if (postData === 404)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        fontSize="1.75rem"
      >
        Page does not exist
      </Box>
    );

  return (
    <Box width="100%" p="2rem 6%">
      <PostWidget
        postId={postData._id}
        postUserId={postData.user._id}
        createdAt={postData.createdAt}
        updatedAt={postData.updatedAt}
        firstName={postData.user.firstName}
        lastName={postData.user.lastName}
        description={postData.description}
        location={postData.user.location}
        picturePath={postData.picturePath}
        userPicturePath={postData.user.picturePath}
        likes={postData.likes}
        comments={postData.comments}
        isEdited={postData.isEdited}
        displayComments={true}
      />
    </Box>
  );
};

export default PostPage;
