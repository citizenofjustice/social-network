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
import FlexCentered from "components/FlexCenterd";

const Navbar = () => {
  const isAuth = Boolean(useSelector((state) => state.auth.token));
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px");

  const { palette } = useTheme();
  const {
    background,
    text,
    shadow,
    themedLargeText,
    hoveredThemedLargeText,
    inputsBackground,
    sidemenuShadow,
  } = palette.custom;

  const handleLogout = () => {
    setIsComponentVisible(false);
    dispatch(setLogout());
  };

  return (
    <FlexBetween
      p="1rem 2rem"
      backgroundColor={background}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: `0 0.125rem 0.125rem -0.125rem ${shadow}`,
      }}
      height="5rem"
    >
      <FlexBetween gap="1.75rem">
        <StyledLink path={!isNonMobileScreen ? "/feed" : "/"}>
          <Typography
            sx={{
              "&:hover": {
                color: hoveredThemedLargeText,
                cursor: "pointer",
              },
            }}
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color={themedLargeText}
          >
            StayInTouch
          </Typography>
        </StyledLink>
        {isAuth && isNonMobileScreen && (
          <SearchBar
            width="20vw"
            style={{
              boxShadow: `1px 1px 2px ${shadow}`,
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
              <DarkMode sx={{ color: text, fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: text, fontSize: "25px" }} />
            )}
          </IconButton>
          {isAuth && (
            <NavbarDropdown
              name={`${user.firstName} ${user.lastName}`}
              color={inputsBackground}
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
            sx={{ color: text, marginLeft: "1rem" }}
            onClick={() => {
              setIsComponentVisible(!isComponentVisible);
            }}
          >
            <Menu />
          </IconButton>
        </Box>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreen && isComponentVisible && (
        <Box
          sx={{
            // for preventing actions triggered by mobile navbar outside click
            width: "100%",
            height: "100%",
            position: "fixed",
            top: "0",
            left: "0",
          }}
        >
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="150px"
            minWidth="100px"
            backgroundColor={background}
            boxShadow={`-1px 0px 2px 1px ${sidemenuShadow}`}
            ref={ref}
          >
            {/* CLOSE ICON */}

            {
              <Box display="flex" justifyContent="center" mt="1.4rem">
                <IconButton
                  onClick={() => {
                    setIsComponentVisible(!isComponentVisible);
                  }}
                  sx={{ color: text }}
                >
                  <Close />
                </IconButton>
              </Box>
            }

            {/* MENU ITEMS */}
            <FlexCentered flexDirection="column" gap="2.5rem" mt="2rem">
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
                    <IconButton
                      sx={{ color: text }}
                      onClick={() => setIsComponentVisible(false)}
                    >
                      <DynamicFeedOutlined sx={{ fontSize: "25px" }} />
                    </IconButton>
                  </StyledLink>
                  <StyledLink path={`/profile/${user._id}`}>
                    <IconButton
                      sx={{ color: text }}
                      onClick={() => setIsComponentVisible(false)}
                    >
                      <PostAdd sx={{ fontSize: "25px" }} />
                    </IconButton>
                  </StyledLink>
                  <StyledLink path="/friends">
                    <IconButton
                      sx={{ color: text }}
                      onClick={() => setIsComponentVisible(false)}
                    >
                      <PeopleOutlineOutlined sx={{ fontSize: "25px" }} />
                    </IconButton>
                  </StyledLink>
                  <StyledLink path="/search">
                    <IconButton
                      sx={{ color: text }}
                      onClick={() => setIsComponentVisible(false)}
                    >
                      <PersonSearchOutlined sx={{ fontSize: "25px" }} />
                    </IconButton>
                  </StyledLink>
                </>
              )}
              <IconButton
                onClick={() => dispatch(setMode())}
                sx={{ color: text, fontSize: "25px" }}
              >
                {palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ fontSize: "25px" }} />
                )}
              </IconButton>
              {isAuth && (
                <IconButton sx={{ color: text }} onClick={handleLogout}>
                  <LogoutOutlined sx={{ fontSize: "25px" }} />
                </IconButton>
              )}
            </FlexCentered>
          </Box>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
