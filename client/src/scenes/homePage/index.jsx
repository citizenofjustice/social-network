import { useCallback, useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { fetchUser } from "API";
import HomePageDesktop from "./HomePageDesktop";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userId = useSelector((state) => state.auth.user._id);
  const userFriends = useSelector((state) => state.auth.user.friends);
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState(null);

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
      width="100%"
      p="2rem 6%"
      display="flex"
      gap="0.5rem"
      justifyContent={"space-between"}
    >
      {isNonMobileScreens && (
          <HomePageDesktop user={user} isNonMobileScreens={isNonMobileScreens} />
      )}
    </Box>
  );
};

export default HomePage;
