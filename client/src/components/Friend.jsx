import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state/authSlice";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import SkeletonLoad from "components/SkeletonLoad";
import { patchFriend } from "API";
import StyledLink from "./StyledLink";

const Friend = ({
  className,
  friendId,
  name,
  subtitle,
  userPicturePath,
  isContentLoading,
  style,
}) => {
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const friends = useSelector((state) => state.auth.user.friends);
  const isOneself = _id === friendId;

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const updateFriend = async () => {
    const friendsData = await patchFriend(_id, friendId, token);
    dispatch(setFriends({ friends: friendsData }));
  };

  return (
    <FlexBetween className={className} sx={style}>
      <FlexBetween gap="1rem" sx={{ width: "100%" }}>
        <StyledLink path={`/profile/${friendId}`}>
          <UserImage
            image={userPicturePath}
            size="55px"
            loading={isContentLoading}
          />
        </StyledLink>
        <Box
          sx={{
            width: "100%",
            mr: "0.75rem",
          }}
        >
          <StyledLink path={`/profile/${friendId}`}>
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: primaryDark,
                  cursor: "pointer",
                },
              }}
            >
              <SkeletonLoad loading={isContentLoading}>{name}</SkeletonLoad>
            </Typography>
          </StyledLink>
          <Typography color={medium} fontSize="0.75rem">
            <SkeletonLoad loading={isContentLoading}>{subtitle}</SkeletonLoad>
          </Typography>
        </Box>
      </FlexBetween>
      {!isOneself && (
        <IconButton
          onClick={() => updateFriend()}
          sx={{
            backgroundColor: primaryLight,
            p: "0.6rem",
          }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
