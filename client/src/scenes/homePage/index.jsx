import { Box, useMediaQuery } from "@mui/material";
import HomePageDesktop from "./HomePageDesktop";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box
      width="100%"
      p="2rem 2rem 0 "
      display="flex"
      gap="1.5rem"
      justifyContent="center"
      alignItems="flex-start"
    >
      {isNonMobileScreens && (
        <HomePageDesktop isNonMobileScreens={isNonMobileScreens} />
      )}
    </Box>
  );
};

export default HomePage;
