import { useTheme } from "@mui/material";
import FlexCentered from "./FlexCenterd";

const DefaultUserIcon = ({
  firstNameInitial,
  lastNameInitial,
  size = "60px",
  fontSize = "1rem",
}) => {
  const { palette } = useTheme();
  const { controls, shadow } = palette.custom;

  return (
    <FlexCentered
      backgroundColor={controls}
      width={size}
      height={size}
      borderRadius="50%"
      textTransform="uppercase"
      fontSize={fontSize}
      border={`1px solid ${shadow}`}
    >
      {firstNameInitial + lastNameInitial}
    </FlexCentered>
  );
};

export default DefaultUserIcon;
