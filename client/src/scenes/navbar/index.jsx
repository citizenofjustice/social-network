import { useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
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
  PersonSearchOutlined,
  PeopleOutlineOutlined,
  DynamicFeedOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "state/authSlice";
import { setMode } from "state/uiSlice";
import { useNavigate, useLocation } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";

import SearchBar from "components/SearchBar";
import useComponentVisible from "hooks/useComponentVisible";
import NavbarDropdown from "components/NavbarDropdown";

const Navbar = () => {
  const isAuth = Boolean(useSelector((state) => state.auth.token));
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryDark = theme.palette.primary.dark;
  const alt = theme.palette.background.alt;

  useEffect(() => {
    // toggle menu when location.pathname changed
    setIsComponentVisible(false);
  }, [location.pathname, setIsComponentVisible]);

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
          onClick={() => navigate(!isNonMobileScreen ? "/feed" : "/")}
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
        {isAuth && isNonMobileScreen && (
          <SearchBar
            width="20vw"
            style={{
              boxShadow: `1px 1px 2px ${dark}`,
              position: "absolute",
              top: "5.5rem",
            }}
          />
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreen ? (
        <FlexBetween gap="1.25rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          {/* <IconButton>
            <Message sx={{ color: dark, fontSize: "25px" }} />
          </IconButton> */}
          {/* <IconButton>
            <Notifications sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton>
            <Help sx={{ fontSize: "25px" }} />
          </IconButton> */}

          {isAuth && (
            <NavbarDropdown
              name={`${user.firstName} ${user.lastName}`}
              color={neutralLight}
              loadingState={isUserLoading}
            />
          )}
          {isAuth && (
            <IconButton
              onClick={() => navigate("/user")}
              style={{ backgroundColor: "transparent" }}
            >
              <UserImage
                loading={isUserLoading}
                image={user.picturePath}
                size="30px"
              />
            </IconButton>
          )}
        </FlexBetween>
      ) : (
        <Box display="flex">
          <IconButton
            sx={{ marginLeft: "1rem" }}
            onClick={() => {
              setIsComponentVisible(!isComponentVisible);
            }}
          >
            <Menu sx={{ color: dark }} />
          </IconButton>
        </Box>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreen && isComponentVisible && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="100px"
          backgroundColor={background}
          ref={ref}
        >
          {/* CLOSE ICON */}

          <Box display="flex" justifyContent="center" p="1rem">
            <IconButton
              onClick={() => {
                setIsComponentVisible(!isComponentVisible);
              }}
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
            <IconButton
              onClick={() => navigate("/user")}
              style={{ backgroundColor: "transparent" }}
            >
              <UserImage
                loading={isUserLoading}
                image={user.picturePath}
                size="40px"
              />
            </IconButton>

            <IconButton onClick={() => navigate("/feed")}>
              <DynamicFeedOutlined sx={{ color: dark, fontSize: "25px" }} />
            </IconButton>
            <IconButton onClick={() => navigate("/friends")}>
              <PeopleOutlineOutlined sx={{ color: dark, fontSize: "25px" }} />
            </IconButton>
            {!isNonMobileScreen && (
              <IconButton onClick={() => navigate("/search")}>
                <PersonSearchOutlined sx={{ color: dark, fontSize: "25px" }} />
              </IconButton>
            )}
            {!isNonMobileScreen && (
              <IconButton onClick={() => navigate("/myposts")}>
                <Message sx={{ color: dark, fontSize: "25px" }} />
              </IconButton>
            )}
            {/* <IconButton>
              <Notifications sx={{ fontSize: "25px" }} />
            </IconButton> */}
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
