import { Search } from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import useComponentVisible from "hooks/useComponentVisible";
import { findUsersLike } from "API";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import StyledLink from "./StyledLink";
import { addErrors, dropError } from "state/uiSlice";

const SearchBar = ({ width, style }) => {
  const [foundUsers, setFoundUser] = useState([]);
  const { duration } = useSelector((state) => state.ui.errors);
  const [searchQuery, setSearchQuery] = useState("");
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  const handleSearch = useCallback(async () => {
    try {
      const data = await findUsersLike(searchQuery, loggedInUserId, token);
      setFoundUser(data);
      setIsComponentVisible(true);
    } catch (err) {
      const errorId = crypto.randomUUID();
      dispatch(
        addErrors({
          error: {
            id: errorId,
            text: "There are some errors in search querry. Try to correct it.",
          },
        })
      );
      setTimeout(() => {
        dispatch(dropError({ errorId }));
      }, duration);
    }
  }, [searchQuery, loggedInUserId, token, setIsComponentVisible, duration]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const timeOutId = setTimeout(async () => {
        handleSearch();
      }, 1000);
      return () => clearTimeout(timeOutId);
    } else {
      setIsComponentVisible(false);
      setFoundUser([]);
    }
  }, [handleSearch, searchQuery.length, setIsComponentVisible]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <FlexBetween
        width={width}
        backgroundColor={neutralLight}
        borderRadius="0.5rem"
        p="0.1rem 1.5rem"
      >
        <InputBase
          sx={{ width: "100%" }}
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton onClick={handleSearch}>
          <Search />
        </IconButton>
      </FlexBetween>
      {isComponentVisible && (
        <FlexBetween
          backgroundColor={neutralLight}
          gap="1rem"
          p="1rem 1.5rem"
          borderRadius="0.5rem"
          sx={{
            flexDirection: "column",
            alignItems: "flex-start",
            boxShadow: style.boxShadow,
            position: style.position,
            top: style.top,
          }}
          ref={ref}
        >
          {foundUsers.length > 0 &&
            foundUsers.map((user) => (
              <Box
                key={user._id}
                onClick={() => {
                  setIsComponentVisible(false);
                  setSearchQuery("");
                }}
              >
                <StyledLink path={`/profile/${user._id}`}>
                  <UserImage image={user.picturePath} size="30px" />
                  <Typography p="0 2rem">{user.name}</Typography>
                </StyledLink>
              </Box>
            ))}
          {foundUsers.length === 0 && searchQuery.length !== 0 && (
            <Typography p="0 2rem">User not found...</Typography>
          )}
        </FlexBetween>
      )}
    </Box>
  );
};

export default SearchBar;
