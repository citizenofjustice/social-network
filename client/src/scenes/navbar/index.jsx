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
  const user = useSelector((state) => state.auth.user);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px");

  const { palette } = useTheme();
  const { background, text, largeText, controls, controlsText } =
    palette.custom;

  // const neutralLight = theme.palette.neutral.light;
  // const dark = theme.palette.neutral.dark;
  // const background = theme.palette.background.default;
  // const primaryDark = theme.palette.primary.dark;
  // const alt = theme.palette.background.alt;

  const handleLogout = () => {
    setIsComponentVisible(false);
    dispatch(setLogout());
  };

  return (
    <FlexBetween
      p="1rem 6%"
      backgroundColor={background}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: `0 0.25rem 0.125rem -0.125rem ${"red"}`, //fix-color
      }}
      height="5rem"
    >
      <FlexBetween gap="1.75rem">
        <StyledLink path={!isNonMobileScreen ? "/feed" : "/"}>
          <Typography
            sx={{
              "&:hover": {
                color: "red", //fix-color
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
              boxShadow: `1px 1px 2px ${"yellow"}`, //fix-color
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
            {palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode
                sx={{ color: "red", /* //fix-color */ fontSize: "25px" }}
              />
            )}
          </IconButton>
          {isAuth && (
            <NavbarDropdown
              name={`${user.firstName} ${user.lastName}`}
              color={"red"} //fix-color
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
            <Menu sx={{ color: "red" }} /* //fix-color */ />
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
                <Close
                  sx={{ color: "red", /* //fix-color */ fontSize: "25px" }}
                />
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
                  <IconButton
                    onClick={() => setIsComponentVisible(false)}
                    style={{ backgroundColor: "transparent" }}
                  >
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
                  <IconButton onClick={() => setIsComponentVisible(false)}>
                    <DynamicFeedOutlined
                      sx={{ color: "red", /* //fix-color */ fontSize: "25px" }}
                    />
                  </IconButton>
                </StyledLink>
                <StyledLink path={`/profile/${user._id}`}>
                  <IconButton onClick={() => setIsComponentVisible(false)}>
                    <PostAdd
                      sx={{ color: "red", /* //fix-color */ fontSize: "25px" }}
                    />
                  </IconButton>
                </StyledLink>
                <StyledLink path="/friends">
                  <IconButton onClick={() => setIsComponentVisible(false)}>
                    <PeopleOutlineOutlined
                      sx={{ color: "red", /* //fix-color */ fontSize: "25px" }}
                    />
                  </IconButton>
                </StyledLink>
                <StyledLink path="/search">
                  <IconButton onClick={() => setIsComponentVisible(false)}>
                    <PersonSearchOutlined
                      sx={{ color: "red", /* //fix-color */ fontSize: "25px" }}
                    />
                  </IconButton>
                </StyledLink>
              </>
            )}
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode
                  sx={{ color: "red", /* //fix-color */ fontSize: "25px" }}
                />
              )}
            </IconButton>
            {isAuth && (
              <IconButton onClick={handleLogout}>
                <LogoutOutlined
                  sx={{ color: "red", /* //fix-color */ fontSize: "25px" }}
                />
              </IconButton>
            )}
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
