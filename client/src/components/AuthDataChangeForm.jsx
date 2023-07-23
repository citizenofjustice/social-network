import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";

const initialValuesLogin = {
  email: "",
  password: "",
};

const AuthDataChangeForm = ({ refProp }) => {
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);
  const { palette } = useTheme();

  const handleAuthDataChange = () => {};

  const handleEmailToggle = (event) => {
    setIsEmailChecked(event.target.checked);
  };
  const handlePasswordToggle = (event) => {
    setIsPasswordChecked(event.target.checked);
  };

  return (
    <Box ref={refProp}>
      <Formik
        onSubmit={handleAuthDataChange}
        initialValues={initialValuesLogin}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                backgroundColor: "white",
                padding: "1rem",
                borderRadius: "0.5rem",
                display: "grid",
                gap: "1rem",
                width: "500px",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  gridColumn: "span 4",
                  fontSize: "1rem",
                }}
              >
                Choose what you want to change
              </Typography>
              <FormGroup
                sx={{
                  gridColumn: "span 4",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isEmailChecked}
                        onChange={handleEmailToggle}
                      />
                    }
                    label="E-mail"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isPasswordChecked}
                        onChange={handlePasswordToggle}
                      />
                    }
                    label="Password"
                  />
                </Box>
              </FormGroup>
              {isEmailChecked && (
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
              )}
              {isPasswordChecked && (
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              )}
              {(isEmailChecked || isPasswordChecked) && (
                <Box sx={{ gridColumn: "span 4" }}>
                  <Button
                    sx={{
                      display: "block",
                      margin: "0 auto",
                      backgroundColor: palette.primary.main,
                      color: palette.background.alt,
                      "&:hover": { color: palette.primary.main },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AuthDataChangeForm;
