import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { fetchFriends } from "API";

import WidgetWrapper from "components/WidgetWrapper";
import Slider from "components/Slider";

const FriendListWidget = ({ userId, isOneself = true }) => {
  // const [isFriendListLoadnig, setIsFriendListLoading] = useState(false);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const token = useSelector((state) => state.auth.token);
  const friends = useSelector((state) => state.auth.user.friends);
  const [friendsList, setFriendsList] = useState([]);

  const getFriends = useCallback(
    async (signal) => {
      const friendsData = await fetchFriends(userId, token, signal);
      setFriendsList(friendsData);
    },
    [userId, token]
  );

  useEffect(() => {
    const abortController = new AbortController();
    getFriends(abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [getFriends, friends]);

  return (
    <WidgetWrapper>
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
