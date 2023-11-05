import { Search } from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import useComponentVisible from "hooks/useComponentVisible";
import { findUsersLike } from "API";
import { useSelector } from "react-redux";
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

const SearchBar = ({ width, style }) => {
  const [foundUsers, setFoundUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const token = useSelector((state) => state.auth.token);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  const handleSearch = useCallback(async () => {
    const data = await findUsersLike(searchQuery, loggedInUserId, token);
    setFoundUser(data);
    setIsComponentVisible(true);
  }, [searchQuery, loggedInUserId, token, setIsComponentVisible]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const timeOutId = setTimeout(async () => {
        handleSearch();
      }, 1000);
      return () => clearTimeout(timeOutId);
    } else {
      setFoundUser([]);
    }
  }, [handleSearch, searchQuery.length]);

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
          {foundUsers.map((user) => (
            <StyledLink path={`/profile/${user._id}`}>
              <UserImage image={user.picturePath} size="30px" />
              <Typography p="0 2rem">{user.name}</Typography>
            </StyledLink>
          ))}
          {foundUsers.length === 0 && (
            <Typography p="0 2rem">User not found...</Typography>
          )}
        </FlexBetween>
      )}
    </Box>
  );
};

export default SearchBar;
