import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import * as yup from "yup";

import { loginUser } from "API";
import { setLogin } from "state/authSlice";
import { showMessage } from "state/uiSlice";
import PasswordTextField from "components/PasswordTextField";
import CustomCircularLoading from "components/CustomCircularLoading";

// validation schema for login form
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"), // must match the email
  password: yup.string().required("required"),
});

// initial values for login form
const initialValues = {
  email: "",
  password: "",
};

/* Login form component */
const LoginForm = ({ onAuthModeChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const { palette } = useTheme();
  // const primary = palette.primary.main;
  // const alt = palette.background.alt;
  // const light = palette.primary.light;
  const { background, text, controls, controlsText, hoveredControls } =
    palette.custom;

  // calling useMutation hook for logging in user
  const mutation = useMutation({
    mutationFn: async (values) => {
      // fetching user Data with passed credentials
      const response = await loginUser(values);
      if (!response.ok) {
        const { error } = await response.json();
        if (error.message) throw new Error(error.message);
        throw new Error(error); // if request failed throw error
      }
      const loggedIn = await response.json();
      // setting storage states with recived userData
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      return loggedIn;
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (err) => {
      dispatch(
        showMessage({ isShown: true, text: err.message, type: "error" })
      );
    },
  });

  // handle form submission
  const handleFormSubmit = (values) => {
    mutation.mutate(values);
  };

  // lifting the state up (change of auth page mode)
  const handleAuthModeChange = () => {
    onAuthModeChange();
  };

  // handle button click event while request already pending
  const handleButtonDisable = (e) => {
    if (mutation.isLoading) {
      e.preventDefault();
      return;
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        resetForm, // resetting to initial input values
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              autoComplete="on"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <PasswordTextField
              label="Password"
              handleBlur={handleBlur}
              handleChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          <Box m="1.5rem 0" display="flex" justifyContent="center">
            <Button
              type="submit"
              sx={{
                width: "10rem",
                height: "2.5rem",
                backgroundColor: controls,
                color: controlsText,
                "&:hover": { backgroundColor: hoveredControls },
              }}
              onClick={handleButtonDisable}
            >
              {mutation.isLoading ? (
                <CustomCircularLoading
                  margin="0"
                  size="1rem"
                  color={controls}
                  promptText="Signing in..."
                  promptDirectionColumn={false}
                />
              ) : (
                "LOGIN"
              )}
            </Button>
          </Box>
          <Typography
            onClick={() => {
              handleAuthModeChange();
              resetForm();
            }}
            sx={{
              textDecoration: "none",
              textAlign: "center",
              color: controls,
              "&:hover": {
                cursor: "pointer",
                color: hoveredControls,
              },
            }}
          >
            Don't have an account? Sign Up here.
          </Typography>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
