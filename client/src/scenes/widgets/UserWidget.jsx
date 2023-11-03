import {
  ManageAccountsOutlined,
  PersonAddOutlined,
  PersonRemoveOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  SaveOutlined,
  BackspaceOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  IconButton,
  InputBase,
} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import SkeletonLoad from "components/SkeletonLoad";
import SocialNetworks from "components/SocialNetworks";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateProfileInfo } from "API";
import { updateUser } from "state/authSlice";
import { triggerReloadToggle } from "state/postsSlice";
import { patchFriend } from "API";
import { setFriends } from "state/authSlice";

const UserWidget = ({ viewedUserData }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const token = useSelector((state) => state.auth.token);
  const [isFriend, setIsFriend] = useState(
    viewedUserData.friends.find((friend) => {
      if (friend === authUser._id) {
        return friend;
      } else return false;
    })
  );

  const [isProfileBeingEdited, setIsProfileBeingEdited] = useState(false);
  const [firstNameChange, setFirstNameChange] = useState(
    viewedUserData.firstName || null
  );
  const [lastNameChange, setLastNameChange] = useState(
    viewedUserData.lastName || null
  );
  const [locationChange, setLocationChange] = useState(
    viewedUserData.location || null
  );
  const [occupationChange, setOccupationChange] = useState(
    viewedUserData.occupation || null
  );
  const [currentUserData, setCurrentUserData] = useState(authUser);

  const navigate = useNavigate();
  const routerLocation = useLocation();
  const isProfilePage =
    /^\/profile\/.*$/.test(routerLocation.pathname) ||
    /^\/user/.test(routerLocation.pathname);

  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const light = palette.neutral.light;
  const main = palette.neutral.main;
  const primaryDark = palette.primary.dark;
  const primaryLight = palette.primary.light;

  if (!viewedUserData) return null;
  const {
    _id,
    firstName,
    lastName,
    picturePath,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    socials,
  } = viewedUserData;
  const isOneself = authUser._id === _id;

  const handleProfileUpdate = async () => {
    if (isProfileBeingEdited) {
      const changedUserState = {
        ...currentUserData,
        firstName: firstNameChange,
        lastName: lastNameChange,
        location: locationChange,
        occupation: occupationChange,
      };

      const formData = new FormData();
      formData.append("userData", JSON.stringify(changedUserState, null, 2));

      const result = await updateProfileInfo(formData, authUser._id, token);
      if (result)
        dispatch(
          updateUser({
            user: result,
          })
        );
      dispatch(triggerReloadToggle());
      setIsProfileBeingEdited(false);
    } else {
      setIsProfileBeingEdited(true);
    }
  };

  const handleProfileEditCancelation = () => {
    setFirstNameChange(authUser.firstName);
    setLastNameChange(authUser.lastName);
    setLocationChange(authUser.location);
    setOccupationChange(authUser.occupation);
    setIsProfileBeingEdited(false);
  };

  const handleProfilesChange = (profiles) => {
    let changedUserState = { ...currentUserData, socials: profiles };
    setCurrentUserData(changedUserState);
  };

  const updateFriend = async () => {
    if (isOneself) return;
    const friendsData = await patchFriend(
      currentUserData._id,
      viewedUserData._id,
      token
    );
    dispatch(setFriends({ friends: friendsData }));
    setIsFriend((prevState) => !prevState);
  };

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        {isProfileBeingEdited ? (
          <>
            <InputBase
              sx={{
                width: "100%",
                backgroundColor: light,
                padding: "0.25rem 0.5rem",
                borderRadius: "0.5rem",
              }}
              placeholder="Set first name"
              value={firstNameChange}
              onChange={(e) => setFirstNameChange(e.target.value)}
            />
            <InputBase
              sx={{
                width: "100%",
                backgroundColor: light,
                padding: "0.25rem 0.5rem",
                borderRadius: "0.5rem",
              }}
              placeholder="Set last name"
              value={lastNameChange}
              onChange={(e) => setLastNameChange(e.target.value)}
            />
          </>
        ) : (
          <FlexBetween
            onClick={() => navigate(`/profile/${_id}`)}
            gap="1rem"
            sx={{ width: "100%" }}
          >
            <UserImage image={picturePath} loading={isUserLoading} />
            <Box sx={{ width: "100%", padding: "0.5rem" }}>
              <SkeletonLoad loading={isUserLoading} count={2}>
                <Typography
                  variant="h4"
                  color={dark}
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: primaryDark,
                      cursor: "pointer",
                    },
                  }}
                >
                  {firstName} {lastName}
                </Typography>
                <Typography color={medium}>{friends.length} friends</Typography>
              </SkeletonLoad>
            </Box>
          </FlexBetween>
        )}
        {isProfilePage && (
          <>
            {isOneself ? (
              <>
                {isProfileBeingEdited && (
                  <IconButton onClick={handleProfileEditCancelation}>
                    <BackspaceOutlined />
                  </IconButton>
                )}
                <IconButton onClick={handleProfileUpdate}>
                  {isProfileBeingEdited ? (
                    <SaveOutlined />
                  ) : (
                    <ManageAccountsOutlined />
                  )}
                </IconButton>
              </>
            ) : (
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
          </>
        )}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-evenly"
        p="0.25rem 0"
        mb="0.5rem"
        sx={{ width: "100%" }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap="1rem"
          paddingRight="1rem"
          marginTop="0.5rem"
        >
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          {isProfileBeingEdited ? (
            <InputBase
              sx={{
                width: "100%",
                backgroundColor: light,
                padding: "0.25rem 0.5rem",
                borderRadius: "0.5rem",
              }}
              placeholder="Set location"
              value={locationChange}
              onChange={(e) => setLocationChange(e.target.value)}
            />
          ) : (
            <Typography
              color={medium}
              textAlign="center"
              sx={{ width: "100%" }}
            >
              <SkeletonLoad loading={isUserLoading} width="5rem" count={1}>
                {location}
              </SkeletonLoad>
            </Typography>
          )}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap="1rem"
          marginTop="0.5rem"
          paddingRight="1rem"
        >
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          {isProfileBeingEdited ? (
            <InputBase
              sx={{
                width: "100%",
                backgroundColor: light,
                padding: "0.25rem 0.5rem",
                borderRadius: "0.5rem",
              }}
              placeholder="Set occupation"
              value={occupationChange}
              onChange={(e) => setOccupationChange(e.target.value)}
            />
          ) : (
            <Typography
              color={medium}
              textAlign="center"
              sx={{ width: "100%" }}
            >
              <SkeletonLoad loading={isUserLoading} width="5rem" count={1}>
                {occupation}
              </SkeletonLoad>
            </Typography>
          )}
        </Box>
      </Box>

      <Divider />

      {isOneself && (
        <>
          {/* THIRD ROW */}
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-evenly"
            p="0.5rem 0"
          >
            <FlexBetween padding="0.5rem">
              <Typography color={medium} mr="0.5rem">
                Who's viewed your profile
              </Typography>
              <Typography
                color={main}
                fontWeight="500"
                width="2rem"
                textAlign="right"
              >
                <SkeletonLoad loading={isUserLoading} count={1}>
                  {viewedProfile}
                </SkeletonLoad>
              </Typography>
            </FlexBetween>
            <FlexBetween padding="0.5rem">
              <Typography color={medium} mr="0.5rem">
                Impressions of your post
              </Typography>
              <Typography color={main} fontWeight="500" textAlign="right">
                <SkeletonLoad loading={isUserLoading} width="2rem" count={1}>
                  {impressions}
                </SkeletonLoad>
              </Typography>
            </FlexBetween>
          </Box>

          <Divider />
        </>
      )}

      {/* FOURTH ROW */}
      <SocialNetworks
        isOneself={isOneself}
        isUserLoading={isUserLoading}
        isProfileBeingEdited={isProfileBeingEdited}
        socials={socials}
        onProfilesChange={handleProfilesChange}
      />
    </WidgetWrapper>
  );
};

export default UserWidget;
