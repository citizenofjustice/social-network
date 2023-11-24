import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import UserWidget from "scenes/widgets/UserWidget";
import FeedWidget from "scenes/widgets/FeedWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";

/* Component for desktop version of homepage */
const HomePageDesktop = ({ isNonMobileScreens }) => {
  // getting userData for passing it down to child components
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Box
        sx={{ position: "sticky", top: "2rem" }}
        flexBasis={isNonMobileScreens ? "26%" : undefined}
      >
        <UserWidget viewedUserData={user} />
      </Box>
      <Box
        flexBasis={isNonMobileScreens ? "42%" : undefined}
        mt={isNonMobileScreens ? undefined : "2rem"}
      >
        {/* <FeedWidget /> */}
      </Box>
      {isNonMobileScreens && (
        <Box flexBasis="26%" sx={{ position: "sticky", top: "2rem" }}>
          {/* <AdvertWidget /> */}
          <Box m="2rem 0" />
          {/* <FriendListWidget /> */}
        </Box>
      )}
    </>
  );
};

export default HomePageDesktop;
