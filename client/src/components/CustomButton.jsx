import { Button } from "@mui/material";
import CustomCircularLoading from "./CustomCircularLoading";
import { useTheme } from "@emotion/react";

const CustomButton = ({
  disabled = false,
  margin = 0,
  onClick,
  buttonType,
  inAction = false,
  actionPrompt,
  width = "fit-content",
  children,
}) => {
  const { palette } = useTheme();
  const { controls, hoveredControls, controlsText } = palette.custom;

  // handle button click event while request already pending
  const handleButtonDisable = (e) => {
    if (inAction) {
      e.preventDefault();
      return;
    } else {
      onClick && onClick();
    }
  };

  return (
    <Button
      disabled={disabled}
      type={buttonType}
      sx={{
        width: width,
        height: "2.5rem",
        margin: margin,
        backgroundColor: controls,
        color: inAction ? hoveredControls : controlsText,
        "&:hover": {
          backgroundColor: hoveredControls,
          color: inAction ? controls : controlsText,
        },
      }}
      onClick={handleButtonDisable}
    >
      {inAction ? (
        <CustomCircularLoading
          margin="0"
          size="1rem"
          promptText={actionPrompt}
          promptDirectionColumn={false}
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
