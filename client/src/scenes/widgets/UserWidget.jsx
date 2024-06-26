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
  Button,
  useMediaQuery,
} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import SkeletonLoad from "components/SkeletonLoad";
import SocialNetworks from "components/SocialNetworks";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateProfileInfo } from "API";
import { updateUser } from "state/authSlice";
import { patchFriend } from "API";
import { setFriends } from "state/authSlice";
import StyledLink from "components/StyledLink";
import DefaultUserIcon from "components/DefaultUserIcon";
import FlexCentered from "components/FlexCenterd";
import FlexEvenly from "components/FlexEvenly";
import { useQueryClient } from "react-query";

const UserWidget = ({ viewedUserData }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const token = useSelector((state) => state.auth.token);
  const isMobile = useMediaQuery("(max-width: 375px)");
  const queryClient = useQueryClient();

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

  const routerLocation = useLocation();
  const isProfilePage =
    /^\/profile\/.*$/.test(routerLocation.pathname) ||
    /^\/user/.test(routerLocation.pathname);

  const { palette } = useTheme();
  const {
    text,
    largeText,
    controls,
    controlsText,
    hoveredControls,
    inputsBackground,
  } = palette.custom;

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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
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
      await queryClient.invalidateQueries({ queryKey: "posts" });
      setIsProfileBeingEdited(false);
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
  };

  return (
    <WidgetWrapper>
      <form onSubmit={handleProfileUpdate}>
        {/* FIRST ROW */}
        <FlexBetween gap="0.5rem" pb="1.1rem">
          {isProfileBeingEdited ? (
            <>
              <Box>
                {picturePath ? (
                  <UserImage image={picturePath} loading={isUserLoading} />
                ) : (
                  <DefaultUserIcon
                    firstNameInitial={firstName[0]}
                    lastNameInitial={lastName[0]}
                    fontSize="1.5rem"
                  />
                )}
              </Box>
              <Box
                display="grid"
                gridTemplateColumns="1fr"
                rowGap="0.5rem"
                width="100%"
                padding="0.5rem"
              >
                <InputBase
                  sx={{
                    backgroundColor: inputsBackground,
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.5rem",
                  }}
                  required={true}
                  placeholder="Set first name"
                  value={firstNameChange}
                  onChange={(e) => setFirstNameChange(e.target.value)}
                />
                <InputBase
                  sx={{
                    backgroundColor: inputsBackground,
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.5rem",
                  }}
                  required={true}
                  placeholder="Set last name"
                  value={lastNameChange}
                  onChange={(e) => setLastNameChange(e.target.value)}
                />
              </Box>
            </>
          ) : (
            <StyledLink path={`/profile/${_id}`}>
              <FlexBetween gap="0.5rem" sx={{ width: "100%" }}>
                <Box>
                  {picturePath ? (
                    <UserImage image={picturePath} loading={isUserLoading} />
                  ) : (
                    <DefaultUserIcon
                      firstNameInitial={firstName[0]}
                      lastNameInitial={lastName[0]}
                      fontSize="1.5rem"
                    />
                  )}
                </Box>
                <Box sx={{ width: "100%", padding: "0.5rem" }}>
                  <SkeletonLoad loading={isUserLoading} count={2}>
                    <Typography
                      variant={isMobile ? "h5" : "h4"}
                      color={largeText}
                      fontWeight="500"
                      sx={{
                        wordBreak: isMobile ? "break-word" : "normal",
                        "&:hover": {
                          color: controls,
                          cursor: "pointer",
                        },
                      }}
                    >
                      {firstName} {lastName}
                    </Typography>
                    <Typography color={text}>
                      {`${friends.length} ${
                        friends.length === 1 ? "subscription" : "subscriptions"
                      }`}
                    </Typography>
                  </SkeletonLoad>
                </Box>
              </FlexBetween>
            </StyledLink>
          )}
          {isProfilePage && (
            <>
              {isOneself ? (
                <Box display="grid" gridTemplateColumns="1fr" rowGap="0.5rem">
                  {isProfileBeingEdited && (
                    <IconButton
                      sx={{ color: text }}
                      onClick={handleProfileEditCancelation}
                    >
                      <BackspaceOutlined />
                    </IconButton>
                  )}
                  {isProfileBeingEdited ? (
                    <Button
                      variant="string"
                      type="submit"
                      sx={{
                        borderRadius: "50%",
                        padding: "0.5rem",
                        minWidth: "fit-content",
                        color: text,
                      }}
                    >
                      <SaveOutlined />
                    </Button>
                  ) : (
                    <IconButton
                      sx={{ color: text }}
                      onClick={() => setIsProfileBeingEdited(true)}
                    >
                      <ManageAccountsOutlined />
                    </IconButton>
                  )}
                </Box>
              ) : (
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
                  {authUser.friends.find((friend) => friend === _id) ? (
                    <PersonRemoveOutlined sx={{ color: controlsText }} />
                  ) : (
                    <PersonAddOutlined sx={{ color: controlsText }} />
                  )}
                </IconButton>
              )}
            </>
          )}
        </FlexBetween>

        <Divider />

        {/* SECOND ROW */}
        <FlexEvenly p="0.25rem 0" mb="0.5rem" sx={{ width: "100%" }}>
          <FlexCentered gap="1rem" paddingRight="1rem" marginTop="0.5rem">
            <LocationOnOutlined fontSize="large" sx={{ color: text }} />
            {isProfileBeingEdited ? (
              <InputBase
                sx={{
                  width: "100%",
                  backgroundColor: inputsBackground,
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.5rem",
                }}
                required={true}
                placeholder="Set location"
                value={locationChange}
                onChange={(e) => setLocationChange(e.target.value)}
              />
            ) : (
              <Typography
                color={text}
                textAlign="center"
                sx={{ width: "100%" }}
              >
                <SkeletonLoad loading={isUserLoading} width="5rem" count={1}>
                  {location}
                </SkeletonLoad>
              </Typography>
            )}
          </FlexCentered>
          <FlexCentered gap="1rem" marginTop="0.5rem" paddingRight="1rem">
            <WorkOutlineOutlined fontSize="large" sx={{ color: text }} />
            {isProfileBeingEdited ? (
              <InputBase
                sx={{
                  width: "100%",
                  backgroundColor: inputsBackground,
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.5rem",
                }}
                required={true}
                placeholder="Set occupation"
                value={occupationChange}
                onChange={(e) => setOccupationChange(e.target.value)}
              />
            ) : (
              <Typography
                color={text}
                textAlign="center"
                sx={{ width: "100%" }}
              >
                <SkeletonLoad loading={isUserLoading} width="5rem" count={1}>
                  {occupation}
                </SkeletonLoad>
              </Typography>
            )}
          </FlexCentered>
        </FlexEvenly>

        <Divider />

        {isOneself && (
          <>
            {/* THIRD ROW */}
            <FlexEvenly p="0.5rem 0">
              <FlexBetween padding="0.5rem">
                <Typography color={text} mr="0.5rem">
                  Who's viewed your profile
                </Typography>
                <Typography
                  color={text}
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
                <Typography color={text} mr="0.5rem">
                  Impressions of your post
                </Typography>
                <Typography color={text} fontWeight="500" textAlign="right">
                  <SkeletonLoad loading={isUserLoading} width="2rem" count={1}>
                    {impressions}
                  </SkeletonLoad>
                </Typography>
              </FlexBetween>
            </FlexEvenly>

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
      </form>
    </WidgetWrapper>
  );
};

export default UserWidget;
