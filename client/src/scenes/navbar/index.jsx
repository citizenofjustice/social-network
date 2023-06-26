import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  LogoutOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "state/authSlice";
import { setMode } from "state/uiSlice";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import SkeletonLoad from "components/SkeletonLoad";
import SearchBar from "components/SearchBar";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryDark = theme.palette.primary.dark;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <FlexBetween
      p="1rem 6%"
      backgroundColor={alt}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: `0 0.25rem 0.125rem -0.125rem ${neutralLight}`,
      }}
      height="5rem"
    >
      <FlexBetween gap="1.75rem">
        <Typography
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryDark,
              cursor: "pointer",
            },
          }}
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
        >
          StayInTouch
        </Typography>
        {isNonMobileScreens && <SearchBar />}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="1.25rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <Message sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton>
            <Notifications sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton>
            <Help sx={{ fontSize: "25px" }} />
          </IconButton>

          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography ml="0.5rem">
                  <SkeletonLoad loading={isUserLoading}>
                    {fullName}
                  </SkeletonLoad>
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>
                <Typography style={{ textAlign: "right" }} ml="0.5rem">
                  Log Out
                </Typography>
              </MenuItem>
            </Select>
          </FormControl>
          <UserImage
            loading={isUserLoading}
            image={user.picturePath}
            size="30px"
          />
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu sx={{ color: dark }} />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="100px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}

          <Box display="flex" justifyContent="center" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close sx={{ color: dark, fontSize: "25px" }} />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="2.5rem"
            mt="2rem"
          >
            <UserImage
              loading={isUserLoading}
              image={user.picturePath}
              size="40px"
            />
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton>
              <Message sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton>
              <Notifications sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton>
              <Help sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton onClick={() => dispatch(setLogout())}>
              <LogoutOutlined sx={{ color: dark, fontSize: "25px" }} />
            </IconButton>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
