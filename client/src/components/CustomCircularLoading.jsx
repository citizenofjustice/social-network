import { Box, CircularProgress, Typography } from "@mui/material";

const CustomCircularLoading = ({
  margin,
  size,
  promptText,
  promptDirectionColumn = true,
}) => {
  return (
    <Box
      display="flex"
      justifyContent={promptText ? "space-evenly" : "center"}
      width="100%"
      alignItems="center"
      flexDirection={promptDirectionColumn ? "column" : "row"}
      margin={margin}
    >
      <CircularProgress size={size} color="inherit" />
      {promptText && <Typography>{promptText}</Typography>}
    </Box>
  );
};

export default CustomCircularLoading;
