import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { fetchСertainPost } from "API";
import PostWidget from "scenes/widgets/PostWidget";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import FlexCentered from "components/FlexCenterd";

const PostPage = () => {
  const token = useSelector((state) => state.auth.token);
  const [postData, setPostData] = useState();
  const location = useLocation();

  const getPostData = useCallback(
    async (signal) => {
      const query = new URLSearchParams(location.search);
      const postId = query.get("id");
      const result = await fetchСertainPost(postId, token, signal);
      if (result) setPostData(result);
    },
    [token, location]
  );

  useEffect(() => {
    const abortController = new AbortController();
    getPostData(abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [getPostData]);

  if (!postData) return <CircularProgress />;
  if (postData === 404)
    return (
      <FlexCentered height="80vh" fontSize="1.75rem">
        Page does not exist
      </FlexCentered>
    );

  return (
    <Box width="100%" p="2rem 6% 0">
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
