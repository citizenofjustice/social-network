import { Box, useMediaQuery } from "@mui/material";
import HomePageDesktop from "./HomePageDesktop";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box
      width="100%"
      p="2rem 6%"
      display="flex"
      gap="0.5rem"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      {isNonMobileScreens && (
        <HomePageDesktop isNonMobileScreens={isNonMobileScreens} />
      )}
    </Box>
  );
};

export default HomePage;
