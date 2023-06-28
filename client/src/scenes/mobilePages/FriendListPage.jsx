import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const FriendListPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userId = useSelector((state) => state.auth.user._id);

  return (
    <Box
      width="100%"
      p="2rem 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="0.5rem"
      justifyContent="space-between"
    >
      <Box flexBasis="26%">
        <FriendListWidget userId={userId} />
      </Box>
    </Box>
  );
};

export default FriendListPage;
