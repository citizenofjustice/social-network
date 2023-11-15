import { Box } from "@mui/material";
import UserWidget from "scenes/widgets/UserWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useSelector } from "react-redux";

const HomePageDesktop = ({ isNonMobileScreens }) => {
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
        <PostsWidget userId={user._id} />
      </Box>
      {isNonMobileScreens && (
        <Box flexBasis="26%" sx={{ position: "sticky", top: "2rem" }}>
          <AdvertWidget />
          <Box m="2rem 0" />
          <FriendListWidget userId={user._id} />
        </Box>
      )}
    </>
  );
};

export default HomePageDesktop;
