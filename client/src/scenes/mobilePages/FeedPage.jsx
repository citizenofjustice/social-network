import { Box } from "@mui/material";
import FeedWidget from "scenes/widgets/FeedWidget";

const FeedPage = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Box flexBasis="80%" mt="2rem">
        <FeedWidget />
      </Box>
    </Box>
  );
};

export default FeedPage;
