import { Box, useMediaQuery } from "@mui/material";
import FlexCentered from "components/FlexCenterd";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const FriendListPage = () => {
  const isMobile = useMediaQuery("(max-width: 425px)");
  const friendsPerPage = 7; // setting how much friends fits into one slider page

  return (
    <FlexCentered pt="2rem">
      <Box flexBasis={isMobile ? "90%" : "60%"}>
        <FriendListWidget slideСapacity={friendsPerPage} />
      </Box>
    </FlexCentered>
  );
};

export default FriendListPage;
