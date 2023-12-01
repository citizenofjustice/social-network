import { Box } from "@mui/material";
import FlexCentered from "components/FlexCenterd";
import PostPage from "scenes/mobilePages/PostPage";

const PostPageDesktop = () => {
  return (
    <FlexCentered>
      <Box width="60vw">
        <PostPage />
      </Box>
    </FlexCentered>
  );
};

export default PostPageDesktop;
