import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state/authSlice";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import SkeletonLoad from "components/SkeletonLoad";
import { patchFriend } from "API";
import StyledLink from "./StyledLink";
import DefaultUserIcon from "./DefaultUserIcon";

const Friend = ({
  className,
  friendId,
  firstName,
  lastName,
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
  const { lightText, largeText, controls, controlsText, hoveredControls } =
    palette.custom;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const updateFriend = async () => {
    const friendsData = await patchFriend(_id, friendId, token);
    dispatch(setFriends({ friends: friendsData }));
  };

  return (
    <FlexBetween className={className} sx={style}>
      <Box gap="1rem" display="flex" alignItems="center">
        <StyledLink path={`/profile/${friendId}`}>
          {userPicturePath ? (
            <UserImage
              image={userPicturePath}
              size="55px"
              loading={isContentLoading}
            />
          ) : (
            <DefaultUserIcon
              firstNameInitial={firstName[0]}
              lastNameInitial={lastName[0]}
              size="55px"
            />
          )}
        </StyledLink>
        <Box
          sx={{
            width: "100%",
            mr: "0.75rem",
          }}
        >
          <StyledLink path={`/profile/${friendId}`}>
            <Typography
              color={largeText}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: controls,
                  cursor: "pointer",
                },
              }}
            >
              <SkeletonLoad
                loading={isContentLoading}
              >{`${firstName} ${lastName}`}</SkeletonLoad>
            </Typography>
          </StyledLink>
          <Typography color={lightText} fontSize="0.75rem">
            <SkeletonLoad loading={isContentLoading}>{subtitle}</SkeletonLoad>
          </Typography>
        </Box>
      </Box>
      {!isOneself && (
        <IconButton
          onClick={() => updateFriend()}
          sx={{
            p: "0.6rem",
            backgroundColor: controls,
            "&:hover": {
              backgroundColor: hoveredControls,
            },
          }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: controlsText }} />
          ) : (
            <PersonAddOutlined sx={{ color: controlsText }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
