import { Box, CircularProgress, Typography } from "@mui/material";

const CustomCircularLoading = ({
  margin,
  size,
  color,
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
      <CircularProgress size={size} style={{ color: color }} />
      {promptText && <Typography color={color}>{promptText}</Typography>}
    </Box>
  );
};

export default CustomCircularLoading;
