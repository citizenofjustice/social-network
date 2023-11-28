import { Box, useMediaQuery } from "@mui/material";
import FeedWidget from "scenes/widgets/FeedWidget";

const FeedPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box
      width="100%"
      p="0 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="0.5rem"
      justifyContent="space-between"
    >
      <Box
        flexBasis={isNonMobileScreens ? "42%" : undefined}
        mt={isNonMobileScreens ? undefined : "2rem"}
      >
        <FeedWidget />
      </Box>
    </Box>
  );
};

export default FeedPage;
