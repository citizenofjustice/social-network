import { Button } from "@mui/material";
import CustomCircularLoading from "./CustomCircularLoading";

const CustomButton = ({
  buttonType,
  backgroundColor,
  hoveredBackgroundColor,
  textColor,
  inAction = false,
  actionPrompt,
  children,
}) => {
  // handle button click event while request already pending
  const handleButtonDisable = (e) => {
    if (inAction) {
      e.preventDefault();
      return;
    }
  };

  return (
    <Button
      type={buttonType}
      sx={{
        width: "10rem",
        height: "2.5rem",
        backgroundColor: backgroundColor,
        color: inAction ? hoveredBackgroundColor : textColor,
        "&:hover": {
          backgroundColor: hoveredBackgroundColor,
          color: inAction ? backgroundColor : textColor,
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
