import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";

import WidgetWrapper from "components/WidgetWrapper";
import Slider from "components/Slider";

const FriendListWidget = ({ userId }) => {
  // const [isFriendListLoadnig, setIsFriendListLoading] = useState(false);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const token = useSelector((state) => state.auth.token);
  const friends = useSelector((state) => state.auth.user.friends);
  const [friendsList, setFriendsList] = useState([]);

  const { palette } = useTheme();
  const dark = palette.neutral.dark;

  const getFriends = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setFriendsList(data);
  }, [userId, token]);

  useEffect(() => {
    getFriends();
  }, [getFriends, friends]);

  return (
    <WidgetWrapper>
      <Box overflow="hidden">
        {friendsList.length > 0 && (
          <Slider
            list={friendsList}
            chunkSize={4}
            isContentLoading={isUserLoading}
          >
            <Typography color={dark} variant="h5" fontWeight="500">
              Friend List
            </Typography>
          </Slider>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
