import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Dropzone from "react-dropzone";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FlexBetween from "components/FlexBetween";
import { fetchFriends, loginUser, registerUser } from "API";
import { setFriends, setIsUserLoading, setLogin } from "state/authSlice";

import PasswordTextField from "components/PasswordTextField";
import { showMessage } from "state/uiSlice";

// schema validation for registration
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"), // must match the email
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  avatar: yup
    .mixed()
    .test("fileSize", "File size too large, max file size is 10 Mb", (file) =>
      file ? file.size <= 10485760 : true
    ), // cannot exceed 10 MB file size
});

// schema validation for login
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"), // must match the email
  password: yup.string().required("required"),
});

// initial values for registration
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  avatar: "",
};

/* Form component used for authentication */
const Form = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isLogin, setIsLogin] = useState(true);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const register = async (values, onSubmitProps) => {
    try {
      // this allows us to send form info with image
      const formData = new FormData();
      // add input data into FormData
      for (let value in values) {
        formData.append(value, values[value]);
      }

      setIsRequestPending(true);
      // send request for registration
      const savedUser = await registerUser(formData);
      setIsRequestPending(false);
      // reset inputs to initial values

      if (savedUser.error) {
        dispatch(
          showMessage({ isShown: true, text: savedUser.error, type: "error" })
        );
      } else {
        // if registration was successful show login form
        setIsLogin(true);
        onSubmitProps.resetForm();
      }
    } catch (err) {
      dispatch(
        showMessage({ isShown: true, text: err.message, type: "error" })
      );
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      dispatch(setIsUserLoading());
      const loggedIn = await loginUser(values);
      if (!loggedIn.error) {
        onSubmitProps.resetForm();
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        dispatch(setIsUserLoading());
        const friendsData = await fetchFriends(
          loggedIn.user._id,
          loggedIn.token
        );
        dispatch(
          setFriends({
            friends: friendsData,
          })
        );
        navigate("/");
      } else {
        dispatch(
          showMessage({ isShown: true, text: loggedIn.error, type: "error" })
        );
        dispatch(setIsUserLoading());
      }
    } catch (err) {
      dispatch(
        showMessage({ isShown: true, text: err.message, type: "error" })
      );
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) {
      await login(values, onSubmitProps);
    } else {
      await register(values, onSubmitProps);
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={isLogin ? loginSchema : registerSchema}
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
          {isRequestPending ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <CircularProgress />
              <Typography marginTop="1rem" fontWeight="500" variant="h6">
                Registration is in progress...
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                {!isLogin && (
                  <>
                    <TextField
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      autoComplete="on"
                      error={
                        Boolean(touched.firstName) && Boolean(errors.firstName)
                      }
                      helperText={touched.firstName && errors.firstName}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      autoComplete="on"
                      error={
                        Boolean(touched.lastName) && Boolean(errors.lastName)
                      }
                      helperText={touched.lastName && errors.lastName}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Location"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.location}
                      name="location"
                      autoComplete="on"
                      error={
                        Boolean(touched.location) && Boolean(errors.location)
                      }
                      helperText={touched.location && errors.location}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      label="Occupation"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.occupation}
                      name="occupation"
                      autoComplete="on"
                      error={
                        Boolean(touched.occupation) &&
                        Boolean(errors.occupation)
                      }
                      helperText={touched.occupation && errors.occupation}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <Box
                      gridColumn="span 4"
                      border={`1px solid ${palette.neutral.medium}`}
                      borderRadius="5px"
                      p="1rem"
                    >
                      <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) =>
                          setFieldValue("avatar", acceptedFiles[0])
                        }
                      >
                        {({ getRootProps, getInputProps }) => (
                          <Box
                            {...getRootProps()}
                            border={`2px dashed ${palette.primary.main}`}
                            p="1rem"
                            sx={{
                              "&:hover": {
                                cursor: "pointer",
                              },
                            }}
                          >
                            <input {...getInputProps()} />
                            {!values.avatar ? (
                              <p>Add Picture Here</p>
                            ) : (
                              <FlexBetween>
                                <Typography>{values.avatar.name}</Typography>
                                <EditOutlinedIcon />
                              </FlexBetween>
                            )}
                          </Box>
                        )}
                      </Dropzone>
                    </Box>
                  </>
                )}

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

              {/* BUTTONS */}
              <Box>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  {isLogin ? "LOGIN" : "REGISTER"}
                </Button>
                <Typography
                  onClick={() => {
                    setIsLogin((prevState) => !prevState);
                    resetForm();
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up here."
                    : "Already have an account? Login here."}
                </Typography>
              </Box>
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

export default Form;
