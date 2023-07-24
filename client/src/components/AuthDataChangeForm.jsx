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
import * as yup from "yup";
import { useState } from "react";
import { changeAuthData } from "API";
import { useSelector } from "react-redux";

const initialValues = {
  email: "",
  password: "",
};

const AuthDataChangeForm = ({ refProp }) => {
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);
  const { palette } = useTheme();
  const emailYup = yup.string().email("invalid email").required("required");
  const passwordYup = yup.string().required("required");
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.token);

  const valSchema = yup.object().shape({
    ...(isEmailChecked && { email: emailYup }),
    ...(isPasswordChecked && { password: passwordYup }),
  });

  const handleAuthDataChange = async (values, onSubmitProps) => {
    const formData = new FormData();
    if (values.email) formData.append("email", values.email);
    if (values.password) formData.append("password", values.password);
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
                display: "grid",
                gap: "1rem",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  gridColumn: "span 4",
                  fontSize: "1rem",
                  padding: "0 1rem",
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
