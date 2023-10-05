import {
  FormControl,
  Select,
  InputBase,
  Typography,
  MenuItem,
  Box,
} from "@mui/material";
import SkeletonLoad from "components/SkeletonLoad";
import { setLogout } from "state/authSlice";
import { useDispatch } from "react-redux";
import useComponentVisible from "hooks/useComponentVisible";
import AuthDataChangeForm from "./AuthDataChangeForm";

const NavbarDropdown = ({ name, color, loadingState }) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false, true);
  const dispatch = useDispatch();

  const handleModalClosing = (changeSuccess) => {
    if (changeSuccess) setIsComponentVisible(false);
  };

  return (
    <>
      <FormControl variant="standard" value={name}>
        <Select
          value={name}
          sx={{
            backgroundColor: color,
            width: "150px",
            borderRadius: "0.25rem",
            p: "0.25rem 1rem",
            "& .MuiSvgIcon-root": {
              pr: "0.25rem",
              width: "3rem",
            },
            "& .MuiSelect-select:focus": {
              backgroundColor: color,
            },
          }}
          input={<InputBase />}
        >
          <MenuItem value={name}>
            <Typography ml="0.5rem">
              <SkeletonLoad loading={loadingState}>{name}</SkeletonLoad>
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => setIsComponentVisible(true)}>
            <Typography style={{ textAlign: "right" }} ml="0.5rem">
              Change Auth Data
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => dispatch(setLogout())}>
            <Typography style={{ textAlign: "right" }} ml="0.5rem">
              Log Out
            </Typography>
          </MenuItem>
        </Select>
      </FormControl>
      {isComponentVisible && (
        <Box
          sx={{
            position: "fixed",
            zIndex: "100",
            backgroundColor: "#7f979ebf",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AuthDataChangeForm
            refProp={ref}
            onChangeSuccess={handleModalClosing}
          />
        </Box>
      )}
    </>
  );
};

export default NavbarDropdown;
