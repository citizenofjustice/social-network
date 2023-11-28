import { Box, useTheme } from "@mui/material";

const DefaultUserIcon = ({
  firstNameInitial,
  lastNameInitial,
  size = "60px",
  fontSize = "1rem",
}) => {
  const { palette } = useTheme();
  const { controls, shadow } = palette.custom;

  return (
    <Box
      backgroundColor={controls}
      width={size}
      height={size}
      borderRadius="50%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      textTransform="uppercase"
      fontSize={fontSize}
      border={`1px solid ${shadow}`}
    >
      {firstNameInitial + lastNameInitial}
    </Box>
  );
};

export default DefaultUserIcon;
