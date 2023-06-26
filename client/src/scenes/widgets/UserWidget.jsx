import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import SkeletonLoad from "components/SkeletonLoad";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserWidget = ({ user }) => {
  const { palette } = useTheme();
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const navigate = useNavigate();

  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const primaryDark = palette.primary.dark;

  if (!user) return null;
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
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        onClick={() => navigate(`/profile/${_id}`)}
        gap="0.5rem"
        pb="1.1rem"
      >
        <FlexBetween gap="1rem" sx={{ width: "100%" }}>
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
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0" sx={{ width: "100%" }}>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium} sx={{ width: "100%" }}>
            <SkeletonLoad loading={isUserLoading} count={1}>
              {location}
            </SkeletonLoad>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium} sx={{ width: "100%" }}>
            <SkeletonLoad loading={isUserLoading} count={1}>
              {occupation}
            </SkeletonLoad>
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium} flex={7}>
            Who's viewed your profile
          </Typography>
          <Typography color={main} fontWeight="500" flex={3} textAlign="right">
            <SkeletonLoad loading={isUserLoading} count={1}>
              {viewedProfile}
            </SkeletonLoad>
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium} flex={7}>
            Impressions of your post
          </Typography>
          <Typography color={main} fontWeight="500" flex={3} textAlign="right">
            <SkeletonLoad loading={isUserLoading} count={1}>
              {impressions}
            </SkeletonLoad>
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <SkeletonLoad loading={isUserLoading} height="2rem">
          <FlexBetween gap="1rem" mb="0.5rem">
            <FlexBetween gap="1rem">
              <img src="../assets/twitter.png" alt="twitter" />
              <Box>
                <Typography color={main} fontWeight="500">
                  Twitter
                </Typography>
                <Typography color={medium}>Social Network</Typography>
              </Box>
            </FlexBetween>
            <EditOutlined sx={{ color: main }} />
          </FlexBetween>
        </SkeletonLoad>

        <SkeletonLoad loading={isUserLoading} height="2rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="1rem">
              <img src="../assets/linkedin.png" alt="linkedin" />
              <Box>
                <Typography color={main} fontWeight="500">
                  Twitter
                </Typography>
                <Typography color={medium}>Network Platform</Typography>
              </Box>
            </FlexBetween>
            <EditOutlined sx={{ color: main }} />
          </FlexBetween>
        </SkeletonLoad>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
