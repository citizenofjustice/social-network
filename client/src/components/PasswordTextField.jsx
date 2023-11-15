import {
  OutlinedInput,
  IconButton,
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
  sx,
}) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined" sx={sx} error={error}>
      <InputLabel htmlFor={`outlined-adornment-${label}`}>{label}</InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${label}`}
        label={label}
        type={isPasswordShown ? "text" : "password"}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        name={name}
        autoComplete="off"
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
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default PasswordTextField;
