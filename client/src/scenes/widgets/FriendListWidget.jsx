import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const FriendListWidget = ({ userId }) => {
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [friendsList, setFriendsList] = useState([]);

  const { palette } = useTheme();
  const dark = palette.neutral.dark;

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setFriendsList(await data);
  };

  useEffect(() => {
    getFriends();
  }, [friends]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friendsList.length > 0 &&
          friendsList.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
            />
          ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
