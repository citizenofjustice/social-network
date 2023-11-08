import { useTheme } from "@emotion/react";
import { ContentCopy } from "@mui/icons-material";
import { Box, IconButton, InputBase } from "@mui/material";

const CopyLink = ({ link, onCopy }) => {
  const { palette } = useTheme();

  const light = palette.neutral.light;
  const alt = palette.background.alt;

  const handleWriteToClipboard = () => {
    navigator.clipboard.writeText(link).then(
      () => {
        /* clipboard successfully set */
        onCopy(false);
      },
      () => {
        /* clipboard write failed */
        console.log("clipboard write failed");
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
