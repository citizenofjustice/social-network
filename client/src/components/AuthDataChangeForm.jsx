import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { changeAuthData } from "API";
import { useSelector } from "react-redux";
import PasswordTextField from "./PasswordTextField";

const initialValues = {
  email: "",
  password: "",
};

const AuthDataChangeForm = ({ refProp }) => {
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);
  const { palette } = useTheme();
  let isPasswordShown = false;

  const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str} character`;
  };

  const emailYup = yup.string().email("invalid email").required("required");
  const passwordYup = yup
    .string()
    .required("required")
    .min(8, "Password must have at least 8 characters")
    // different error messages for different requirements
    .matches(/[0-9]/, getCharacterValidationError("digit"))
    .matches(/[a-z]/, getCharacterValidationError("lowercase"))
    .matches(/[A-Z]/, getCharacterValidationError("uppercase"));
  const confirmPasswordYup = yup
    .string()
    .required("required")
    .oneOf([yup.ref("password")], "Passwords does not match");
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.token);

  const valSchema = yup.object().shape({
    ...(isEmailChecked && { email: emailYup }),
    ...(isPasswordChecked && {
      password: passwordYup,
      confirmPassword: confirmPasswordYup,
    }),
  });

  const handleAuthDataChange = async (values, onSubmitProps) => {
    const formData = new FormData();
    if (values.email) formData.append("email", values.email);
    if (values.password) {
      formData.append("password", values.password);
    }
    console.log("client: ", values.email, " ", values.password);
    await changeAuthData(formData, loggedInUserId, token);
  };

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
        initialValues={initialValues}
        validationSchema={valSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                backgroundColor: palette.background.alt,
                padding: "1rem",
                borderRadius: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "1rem",
                  padding: "0 1rem",
                }}
              >
                Choose what you want to change
              </Typography>
              <FormGroup sx={{}}>
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
                />
              )}
              {isPasswordChecked && (
                <>
                  {/* <TextField
                    label="Old password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.oldPassword}
                    name="oldPassword"
                    error={
                      Boolean(touched.oldPassword) &&
                      Boolean(errors.oldPassword)
                    }
                    helperText={touched.oldPassword && errors.oldPassword}
                  /> */}
                  {/* <TextField
                    label="Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={touched.password && errors.password}
                    
                  />
                  <IconButton style={{ backgroundColor: "transparent" }}>
                    <Visibility />
                  </IconButton> */}
                  <PasswordTextField
                    label="Old password"
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values.oldPassword}
                    name="oldPassword"
                    error={
                      Boolean(touched.oldPassword) &&
                      Boolean(errors.oldPassword)
                    }
                    helperText={touched.oldPassword && errors.oldPassword}
                  />
                  <PasswordTextField
                    label="Password"
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values.password}
                    name="password"
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={touched.password && errors.password}
                  />
                  <PasswordTextField
                    label="Confirm password"
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    error={
                      Boolean(touched.confirmPassword) &&
                      Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  />
                  {/* <TextField
                    label="Confirm password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    error={
                      Boolean(touched.confirmPassword) &&
                      Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  /> */}
                </>
              )}
              {(isEmailChecked || isPasswordChecked) && (
                <Box>
                  <Button
                    type="submit"
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
