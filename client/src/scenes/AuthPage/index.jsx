import { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

/* Authentication page component */
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // state for changing auth page mode
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); // query of screen width for adaptive layout

  const { palette } = useTheme();
  const { background } = palette.custom;

  return (
    <Box
      width={isNonMobileScreens ? "fit-content" : "90%"}
      p="2rem"
      m="2rem auto"
      borderRadius="1.5rem"
      backgroundColor={background}
    >
      <Typography
        fontWeight="500"
        variant="h5"
        sx={{
          mb: "1.5rem",
          textAlign: "center",
        }}
      >
        Welcome to StayInTouch, the Social Media for You!
      </Typography>
      {isLogin ? (
        <LoginForm onAuthModeChange={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onAuthModeChange={() => setIsLogin(true)} />
      )}
    </Box>
  );
};

export default AuthPage;
