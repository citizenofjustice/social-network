import { Box, Divider, useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import UserPostsWidget from "scenes/widgets/UserPostsWidget";
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
  const { body } = palette.custom;

  const getUserData = useCallback(
    async (signal) => {
      const data = await fetchUser(userId, token, signal);
      setUser(data);
    },
    [userId, token]
  );

  useEffect(() => {
    const abortController = new AbortController();
    getUserData(abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [getUserData, userFriends]);

  if (!user) return null;

  return (
    <Box
      sx={{
        display: isNonMobileScreens ? "flex" : "block",
        width: "100%",
        padding: "0rem 6%",
        gap: "1.5rem",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {(isNonMobileScreens || !isOneself) && (
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          sx={{
            position: !isNonMobileScreens && !isOneself ? "static" : "sticky",
            top: "0",
            paddingTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          <UserWidget viewedUserData={user} />
          <Box m="1.5rem 0" />
          <FriendListWidget />
        </Box>
      )}
      <Box
        flexBasis={isNonMobileScreens ? "48%" : undefined}
        sx={{ position: "relative" }}
      >
        {isOneself && (
          <Box
            sx={{
              position: "sticky",
              top: "0",
              zIndex: "10",
              padding: "2rem 0 0",
              background: body,
            }}
          >
            <MyPostWidget
              firstName={user.firstName}
              lastName={user.lastName}
              picturePath={user.picturePath}
            />
            <Divider sx={{ margin: "1rem 0" }} />
          </Box>
        )}
        <Box
          sx={{
            position: "relative",
            zIndex: "5",
            marginTop: isOneself ? 0 : "2rem",
            marginBottom: "1rem",
          }}
        >
          <UserPostsWidget userId={userId} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
