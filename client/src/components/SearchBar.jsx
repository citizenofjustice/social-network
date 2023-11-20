import { useState, useRef } from "react";
import { Search } from "@mui/icons-material";
import { Box, IconButton, InputBase, useTheme } from "@mui/material";

import useComponentVisible from "hooks/useComponentVisible";
import FoundUsersList from "./FoundUsersList";
import FlexBetween from "components/FlexBetween";

/* Searchbar component for finding user by name or an email */
const SearchBar = ({ width, style }) => {
  let timeOutId; // variable for storing timeoutId that needs clearing

  const searchField = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderText, setPlaceholderText] = useState("Search...");
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  // handle search without delay (on enter key or search icon press)
  const handleInstantSearch = () => {
    if (timeOutId) clearTimeout(timeOutId);
    setIsComponentVisible(true);
    setSearchQuery(searchField.current.value);
  };

  // handle search with delay (on input value change)
  const handleDelayedSearch = () => {
    if (timeOutId) clearTimeout(timeOutId);
    timeOutId = setTimeout(async () => {
      handleInstantSearch();
    }, 1200);
  };

  // clearing states & input field value after opening found user page
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
          placeholder={placeholderText}
          inputRef={searchField}
          onChange={handleDelayedSearch}
          onKeyUp={(e) => {
            e.key === "Enter" && handleInstantSearch(); // trigger search on enter key press
          }}
          onFocus={() => setPlaceholderText("Enter name or email...")} // displaying search tip for user
          onBlur={() => setPlaceholderText("Search...")}
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
          <FoundUsersList
            searchQuery={searchQuery}
            onLink={handleFoundUserClick}
          />
        </FlexBetween>
      )}
    </Box>
  );
};

export default SearchBar;
