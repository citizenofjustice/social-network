import { Box, useTheme } from "@mui/material";

const DefaultUserIcon = ({
  firstNameInitial,
  lastNameInitial,
  size = "60px",
  fontSize = "1rem",
}) => {
  const { palette } = useTheme();
  const mainColor = palette.primary.main;

  return (
    <Box
      backgroundColor={mainColor}
      width={size}
      height={size}
      borderRadius="50%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      textTransform="uppercase"
      fontSize={fontSize}
    >
      {firstNameInitial + lastNameInitial}
    </Box>
  );
};

export default DefaultUserIcon;
