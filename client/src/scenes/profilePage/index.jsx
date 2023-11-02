import { Box, Divider, useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { fetchUser } from "API";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const userFriends = useSelector((state) => state.auth.user.friends);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px");
  const isOneself = userId === _id;

  const { palette } = useTheme();
  const background = palette.background.default;

  const getUserData = useCallback(async () => {
    const data = await fetchUser(userId, token);
    setUser(data);
  }, [userId, token]);

  useEffect(() => {
    getUserData();
  }, [getUserData, userFriends]);

  if (!user) return null;

  return (
    <Box
      sx={{
        display: isNonMobileScreens ? "flex" : "block",
        width: "100%",
        padding: "0rem 6%",
        gap: "2rem",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {(isNonMobileScreens || !isOneself) && (
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          sx={{ position: "sticky", top: "0", paddingTop: "2rem" }}
        >
          <UserWidget viewedUserData={user} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
      )}
      <Box
        flexBasis={isNonMobileScreens ? "42%" : undefined}
        sx={{ position: "relative" }}
      >
        {isOneself && (
          <Box
            sx={{
              position: "sticky",
              top: "0",
              zIndex: "10",
              padding: "2rem 0 0",
              backgroundColor: background,
            }}
          >
            <MyPostWidget picturePath={user.picturePath} />
            <Divider sx={{ margin: "1rem 0" }} />
          </Box>
        )}
        <Box sx={{ position: "relative", zIndex: "5" }}>
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
