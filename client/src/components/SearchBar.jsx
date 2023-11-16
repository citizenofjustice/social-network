import { Search } from "@mui/icons-material";
import { useState, useRef } from "react";
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
import DefaultUserIcon from "./DefaultUserIcon";
import { useQuery } from "react-query";

const SearchBar = ({ width, style }) => {
  let timeOutId;

  const [searchQuery, setSearchQuery] = useState("");
  const searchField = useRef();
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  const handleInstantSearch = () => {
    if (timeOutId) clearTimeout(timeOutId);
    setIsComponentVisible(true);
    setSearchQuery(searchField.current.value);
  };

  const handleDelayedSearch = () => {
    if (timeOutId) clearTimeout(timeOutId);
    timeOutId = setTimeout(async () => {
      handleInstantSearch();
    }, 1200);
  };

  const handleFoundUserClick = () => {
    setIsComponentVisible(false);
    searchField.current.value = "";
    setSearchQuery("");
  };

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
          inputRef={searchField}
          onChange={handleDelayedSearch}
          onKeyUp={(e) => {
            e.key === "Enter" && handleInstantSearch();
          }}
        />
        <IconButton onClick={handleInstantSearch}>
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
          <FoundUsers searchQuery={searchQuery} onLink={handleFoundUserClick} />
        </FlexBetween>
      )}
    </Box>
  );
};

const FoundUsers = ({ searchQuery, onLink }) => {
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.token);

  const abortController = new AbortController();
  const signal = abortController.signal;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => findUsersLike(searchQuery, loggedInUserId, token, signal),
    enabled: searchQuery.length > 0,
  });

  if (searchQuery.length === 0)
    return <Typography p="0 2rem">Search query is empty</Typography>;

  if (isLoading) return <Typography p="0 2rem">Loading...</Typography>;

  if (isError) {
    return (
      <Typography p="0 2rem">
        There are some errors in search querry. Try to correct it.
      </Typography>
    );
  }

  return (
    <>
      {data.map((user) => (
        <Box key={user._id} onClick={() => onLink()}>
          <StyledLink path={`/profile/${user._id}`}>
            {user.picturePath ? (
              <UserImage image={user.picturePath} size="30px" />
            ) : (
              <DefaultUserIcon
                firstNameInitial={user.firstName[0]}
                lastNameInitial={user.lastName[0]}
                size="30px"
              />
            )}
            <Typography p="0 2rem">{`${user.firstName} ${user.lastName}`}</Typography>
          </StyledLink>
        </Box>
      ))}
      {data.length === 0 && searchQuery.length !== 0 && (
        <Typography p="0 2rem">User not found...</Typography>
      )}
    </>
  );
};

export default SearchBar;
