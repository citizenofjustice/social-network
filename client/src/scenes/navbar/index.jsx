import { useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  PostAdd,
  DarkMode,
  LightMode,
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
import { useLocation } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";

import SearchBar from "components/SearchBar";
import useComponentVisible from "hooks/useComponentVisible";
import NavbarDropdown from "components/NavbarDropdown";
import StyledLink from "components/StyledLink";
import DefaultUserIcon from "components/DefaultUserIcon";

const Navbar = () => {
  const isAuth = Boolean(useSelector((state) => state.auth.token));
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const dispatch = useDispatch();
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
        <StyledLink path={!isNonMobileScreen ? "/feed" : "/"}>
          <Typography
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
        </StyledLink>
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
          {isAuth && (
            <NavbarDropdown
              name={`${user.firstName} ${user.lastName}`}
              color={neutralLight}
              loadingState={isUserLoading}
            />
          )}
          {isAuth && (
            <StyledLink path={`/profile/${user._id}`}>
              <IconButton style={{ backgroundColor: "transparent" }}>
                {user.picturePath ? (
                  <UserImage
                    loading={isUserLoading}
                    image={user.picturePath}
                    size="30px"
                  />
                ) : (
                  <DefaultUserIcon
                    firstNameInitial={user.firstName[0]}
                    lastNameInitial={user.lastName[0]}
                    size="30px"
                    fontSize="0.75rem"
                  />
                )}
              </IconButton>
            </StyledLink>
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

          {
            <Box display="flex" justifyContent="center" p="1rem">
              <IconButton
                onClick={() => {
                  setIsComponentVisible(!isComponentVisible);
                }}
              >
                <Close sx={{ color: dark, fontSize: "25px" }} />
              </IconButton>
            </Box>
          }

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="2.5rem"
            mt="2rem"
          >
            {isAuth && (
              <>
                <StyledLink path="/user">
                  <IconButton style={{ backgroundColor: "transparent" }}>
                    {user.picturePath ? (
                      <UserImage
                        loading={isUserLoading}
                        image={user.picturePath}
                        size="40px"
                      />
                    ) : (
                      <DefaultUserIcon
                        firstNameInitial={user.firstName[0]}
                        lastNameInitial={user.lastName[0]}
                        size="40px"
                      />
                    )}
                  </IconButton>
                </StyledLink>
                <StyledLink path="feed">
                  <IconButton>
                    <DynamicFeedOutlined
                      sx={{ color: dark, fontSize: "25px" }}
                    />
                  </IconButton>
                </StyledLink>
                <StyledLink path={`/profile/${user._id}`}>
                  <IconButton>
                    <PostAdd sx={{ color: dark, fontSize: "25px" }} />
                  </IconButton>
                </StyledLink>
                <StyledLink path="/friends">
                  <IconButton>
                    <PeopleOutlineOutlined
                      sx={{ color: dark, fontSize: "25px" }}
                    />
                  </IconButton>
                </StyledLink>
                <StyledLink path="/search">
                  <IconButton>
                    <PersonSearchOutlined
                      sx={{ color: dark, fontSize: "25px" }}
                    />
                  </IconButton>
                </StyledLink>
              </>
            )}
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
            {isAuth && (
              <IconButton onClick={() => dispatch(setLogout())}>
                <LogoutOutlined sx={{ color: dark, fontSize: "25px" }} />
              </IconButton>
            )}
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
