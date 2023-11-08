import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { fetchFriends } from "API";

import WidgetWrapper from "components/WidgetWrapper";
import Slider from "components/Slider";

const FriendListWidget = ({ userId, isOneself = true }) => {
  // const [isFriendListLoadnig, setIsFriendListLoading] = useState(false);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const token = useSelector((state) => state.auth.token);
  const friends = useSelector((state) => state.auth.user.friends);
  const [friendsList, setFriendsList] = useState([]);

  const { palette } = useTheme();
  const dark = palette.neutral.dark;

  const getFriends = useCallback(async () => {
    const friendsData = await fetchFriends(userId, token);
    setFriendsList(friendsData);
  }, [userId, token]);

  useEffect(() => {
    getFriends();
  }, [getFriends, friends]);

  return (
    <WidgetWrapper>
      <Typography color={dark} variant="h5" fontWeight="500">
        Friend List
      </Typography>
      <Box overflow="hidden">
        {friendsList.length > 0 && (
          <Slider
            list={friendsList}
            chunkSize={4}
            isContentLoading={isUserLoading}
          />
        )}
        {friendsList.length === 0 && (
          <Box>
            {`${isOneself ? "You" : "User"} haven't added any friends.`}
            {isOneself && <br />}
            {isOneself && "Try to find your friends using search."}
          </Box>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
