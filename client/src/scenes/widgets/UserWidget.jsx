import {
  ManageAccountsOutlined,
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
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateProfileInfo } from "API";
import { updateUser } from "state/authSlice";

const UserWidget = ({ viewedUserData }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const token = useSelector((state) => state.auth.token);

  const [isProfileBeingEdited, setIsProfileBeingEdited] = useState(false);
  const [locationChange, setLocationChange] = useState(viewedUserData.location);
  const [occupationChange, setOccupationChange] = useState(
    viewedUserData.occupation
  );
  const [currentUserData, setCurrentUserData] = useState(authUser);

  const navigate = useNavigate();

  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const light = palette.neutral.light;
  const main = palette.neutral.main;
  const primaryDark = palette.primary.dark;

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
      let changedState = { ...currentUserData };
      changedState.location = locationChange;
      changedState.occupation = occupationChange;
      setCurrentUserData(changedState);

      const formData = new FormData();
      formData.append("userData", JSON.stringify(currentUserData, null, 2));

      const result = await updateProfileInfo(formData, authUser._id, token);
      if (result)
        dispatch(
          updateUser({
            user: result,
          })
        );
      setIsProfileBeingEdited(false);
    } else {
      setIsProfileBeingEdited(true);
    }
  };

  const handleProfileEditCancelation = () => {
    setLocationChange(authUser.location);
    setOccupationChange(authUser.occupation);
    setIsProfileBeingEdited(false);
  };

  const handleProfilesChange = (profiles) => {
    let changedState = { ...currentUserData };
    changedState.socials = profiles;
    setCurrentUserData(changedState);
  };

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
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
        {isOneself && (
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
        )}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0" sx={{ width: "100%" }}>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
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
            <Typography color={medium} sx={{ width: "100%" }}>
              <SkeletonLoad loading={isUserLoading} count={1}>
                {location}
              </SkeletonLoad>
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
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
            <Typography color={medium} sx={{ width: "100%" }}>
              <SkeletonLoad loading={isUserLoading} count={1}>
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
          <Box p="1rem 0">
            <FlexBetween mb="0.5rem">
              <Typography color={medium} flex={7}>
                Who's viewed your profile
              </Typography>
              <Typography
                color={main}
                fontWeight="500"
                flex={3}
                textAlign="right"
              >
                <SkeletonLoad loading={isUserLoading} count={1}>
                  {viewedProfile}
                </SkeletonLoad>
              </Typography>
            </FlexBetween>
            <FlexBetween>
              <Typography color={medium} flex={7}>
                Impressions of your post
              </Typography>
              <Typography
                color={main}
                fontWeight="500"
                flex={3}
                textAlign="right"
              >
                <SkeletonLoad loading={isUserLoading} count={1}>
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
