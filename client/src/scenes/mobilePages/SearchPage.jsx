import { Box, useMediaQuery } from "@mui/material";
import SearchBar from "components/SearchBar";
import WidgetWrapper from "components/WidgetWrapper";

const SearchPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box
      width="100%"
      p="2rem 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="0.5rem"
      justifyContent="space-between"
    >
      <WidgetWrapper sx={{ padding: "1.5rem" }}>
        <SearchBar
          width="100%"
          style={{
            position: "relative",
            top: "0.5rem",
            boxShadow: "none",
          }}
        />
      </WidgetWrapper>
    </Box>
  );
};

export default SearchPage;
