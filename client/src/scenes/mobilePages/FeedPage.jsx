import { Box, useMediaQuery } from "@mui/material";
import FeedWidget from "scenes/widgets/FeedWidget";

const FeedPage = () => {
  const isMobile = useMediaQuery("(max-width: 425px)");
  return (
    <Box display="flex" justifyContent="center">
      <Box flexBasis={isMobile ? "90%" : "65%"} mt="2rem" mb="1rem">
        <FeedWidget />
      </Box>
    </Box>
  );
};

export default FeedPage;
