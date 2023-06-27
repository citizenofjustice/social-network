import { Search } from "@mui/icons-material";
import { useState, useEffect } from "react";
import useComponentVisible from "hooks/useComponentVisible";
import { findUsersLike } from "API";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";

const SearchBar = ({ width }) => {
  const [foundUsers, setFoundUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const token = useSelector((state) => state.auth.token);

  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const neutralLight = theme.palette.neutral.light;

  const handleSearch = (event) => {};

  useEffect(() => {
    if (searchQuery.length > 0) {
      const timeOutId = setTimeout(async () => {
        const data = await findUsersLike(searchQuery, token);
        setFoundUser(data);
        setIsComponentVisible(true);
      }, 1000);
      return () => clearTimeout(timeOutId);
    } else {
      setFoundUser([]);
    }
  }, [searchQuery, token, setIsComponentVisible]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width={width}
      alignItems="center"
    >
      <FlexBetween
        backgroundColor={neutralLight}
        borderRadius="0.5rem"
        p="0.1rem 1.5rem"
      >
        <InputBase
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
            boxShadow: `1px 1px 2px ${dark}`,
            position: "absolute",
            top: "5.5rem",
          }}
          ref={ref}
        >
          {foundUsers.map((user) => (
            <Link
              to={`/profile/${user._id}`}
              key={user._id}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <UserImage image={user.picturePath} size="30px" />
              <Typography p="0 2rem">{user.name}</Typography>
            </Link>
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
