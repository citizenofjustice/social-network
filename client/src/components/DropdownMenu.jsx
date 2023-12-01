import { Box, IconButton, useTheme, Divider } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import useComponentVisible from "hooks/useComponentVisible";
import DropdownMenuItem from "components/DropdownMenuItem";

const DropdownMenu = ({ postId, menuItems, onShareLink }) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const { palette } = useTheme();
  const { inputsBackground } = palette.custom;

  const handleShareLink = (shareData) => {
    onShareLink(shareData);
  };

  return (
    <>
      <IconButton
        onClick={() => setIsComponentVisible((prevState) => !prevState)}
      >
        <MoreHoriz />
        {isComponentVisible && (
          <Box
            sx={{
              backgroundColor: inputsBackground,
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              top: "-10px",
              right: "0",
              zIndex: "10",
            }}
            ref={ref}
          >
            <Divider sx={{ height: "1px", width: "100%" }} />
            {menuItems.map((item, index) => (
              <Box key={index}>
                {item.access && (
                  <DropdownMenuItem
                    postId={postId}
                    menuItem={item}
                    onShare={handleShareLink}
                  />
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
