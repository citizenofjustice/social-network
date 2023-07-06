import { Box, IconButton, useTheme, Divider } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import useComponentVisible from "hooks/useComponentVisible";
import DropdownMenuItem from "components/DropdownMenuItem";

const DropdownMenu = ({ postId, menuItems }) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  return (
    <>
      <IconButton
        onClick={() => setIsComponentVisible((prevState) => !prevState)}
      >
        <MoreHoriz />
        {isComponentVisible && (
          <Box
            sx={{
              backgroundColor: neutralLight,
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              top: "-10px",
              right: "0",
            }}
            ref={ref}
          >
            <Divider sx={{ height: "1px", width: "100%" }} />
            {menuItems.map((item, index) => (
              <Box key={index}>
                {item.access && (
                  <DropdownMenuItem postId={postId} menuItem={item} />
                )}
              </Box>
            ))}
          </Box>
        )}
      </IconButton>
    </>
  );
};

export default DropdownMenu;
