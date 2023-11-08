import { Box } from "@mui/material";
import PostPage from "scenes/mobilePages/PostPage";

const PostPageDesktop = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Box width="60vw">
        <PostPage />
      </Box>
    </Box>
  );
};

export default PostPageDesktop;
