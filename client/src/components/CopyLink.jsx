import { useTheme } from "@emotion/react";
import { ContentCopy } from "@mui/icons-material";
import { Box, IconButton, InputBase } from "@mui/material";
import { showMessage } from "state/uiSlice";
import { useDispatch } from "react-redux";

const CopyLink = ({ link, onCopy }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();

  const light = palette.neutral.light;
  const alt = palette.background.alt;

  const handleWriteToClipboard = () => {
    navigator.clipboard.writeText(link).then(
      () => {
        /* clipboard successfully set */
        onCopy(false);
        dispatch(
          showMessage({
            isShown: true,
            text: "Link copied to clipboard",
            type: "success",
          })
        );
      },
      () => {
        /* clipboard write failed */
        dispatch(
          showMessage({
            text: "Failed to copy link to clipboard",
            type: "error",
          })
        );
      }
    );
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      width="fit-content"
      backgroundColor={light}
      padding="0.5rem"
      borderRadius="0.5rem"
    >
      <InputBase
        label="Size"
        id="outlined-size-normal"
        defaultValue={link}
        readOnly={true}
        sx={{
          backgroundColor: alt,
          padding: "0.25rem 0.5rem",
          borderRadius: "0.5rem",
          marginRight: "0.25rem",
        }}
      />
      <IconButton onClick={handleWriteToClipboard}>
        <ContentCopy />
      </IconButton>
    </Box>
  );
};

export default CopyLink;