import {
  TextField,
  OutlinedInput,
  IconButton,
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const PasswordTextField = ({
  label,
  handleBlur,
  handleChange,
  value,
  name,
  error,
  helperText,
}) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined">
      <FormHelperText />
      <InputLabel htmlFor={`outlined-adornment-${label}`}>{label}</InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${label}`}
        label={label}
        type={isPasswordShown ? "text" : "password"}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        name={name}
        error={error}
        helperText={helperText}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setIsPasswordShown((prevState) => !prevState)}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {isPasswordShown ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default PasswordTextField;
