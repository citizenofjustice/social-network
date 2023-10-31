import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width={isNonMobileScreens ? "fit-content" : "90%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography
          fontWeight="500"
          variant="h5"
          sx={{
            mb: "1.5rem",
          }}
        >
          Welcome to StayInTouch, the Social Media for You!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
