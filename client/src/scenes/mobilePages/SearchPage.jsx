import { useMediaQuery } from "@mui/material";
import FlexCentered from "components/FlexCenterd";
import SearchBar from "components/SearchBar";
import WidgetWrapper from "components/WidgetWrapper";

const SearchPage = () => {
  const isMobile = useMediaQuery("(max-width: 425px)");

  return (
    <FlexCentered pt="2rem">
      <WidgetWrapper
        flexBasis={isMobile ? "90%" : "60%"}
        sx={{ padding: "1.5rem" }}
      >
        <SearchBar
          width="100%"
          style={{
            position: "relative",
            top: "0.5rem",
            boxShadow: "none",
          }}
        />
      </WidgetWrapper>
    </FlexCentered>
  );
};

export default SearchPage;
