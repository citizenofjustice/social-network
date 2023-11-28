import { Box, useMediaQuery } from "@mui/material";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const FriendListPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const friendsPerPage = 7; // setting how much friends fits into one slider page

  return (
    <Box
      width="100%"
      p="2rem 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="0.5rem"
      justifyContent="space-between"
    >
      <Box flexBasis="26%">
        <FriendListWidget slideСapacity={friendsPerPage} />
      </Box>
    </Box>
  );
};

export default FriendListPage;
