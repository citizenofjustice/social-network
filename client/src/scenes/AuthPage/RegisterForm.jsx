import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Input,
  FormControl,
  InputAdornment,
} from "@mui/material";
import { Formik } from "formik";
import { useMutation } from "react-query";
import * as yup from "yup";

import { registerUser } from "API";
import PasswordTextField from "components/PasswordTextField";
import { showMessage } from "state/uiSlice";
import { useDispatch } from "react-redux";
import CustomCircularLoading from "components/CustomCircularLoading";
import { useRef } from "react";

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
  filename: yup
    .string()
    .test(
      "fileSize",
      "File size too large, max file size is 10 Mb",
      function () {
        if (!this.parent.avatar) return true;
        return this.parent.avatar.size <= 10485760;
      }
    ),
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
  filename: "",
};

const RegisterForm = ({ onAuthModeChange }) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const { palette } = useTheme();
  const { background, text, controls, controlsText, hoveredControls } =
    palette.custom;

  // calling useMutation hook for registering user
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await registerUser(formData); // send registration request
      // if status code is not "201 Created" throw an error
      if (response.status !== 201) {
        const { error } = await response.json();
        if (error.message) throw new Error(error.message);
        throw new Error(error); // if request failed throw error
      }
      const registeredUser = await response.json();
      return registeredUser;
    },
    onSuccess: () => {
      onAuthModeChange(); // if registration was successful transition to login form
      dispatch(
        showMessage({
          isShown: true,
          text: "Registration completed successfully",
          type: "success",
        })
      ); // show success notification
    },
    onError: (err) => {
      dispatch(
        showMessage({ isShown: true, text: err.message, type: "error" })
      ); // show error message
    },
  });

  // handle form submission
  const handleFormSubmit = (values) => {
    const formData = new FormData();
    // // add input data into FormData
    for (let value in values) {
      if (values[value] !== "") formData.append(value, values[value]); // exclude empty fields from formData
    }
    mutation.mutate(formData);
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

  const handleFileAddition = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    const [file] = files;
    if (!file) return;
    setFieldValue("filename", file.name);
    setFieldValue("avatar", file);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={registerSchema}
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
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="First Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
              name="firstName"
              autoComplete="on"
              error={Boolean(touched.firstName) && Boolean(errors.firstName)}
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
              error={Boolean(touched.lastName) && Boolean(errors.lastName)}
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
              error={Boolean(touched.location) && Boolean(errors.location)}
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
              error={Boolean(touched.occupation) && Boolean(errors.occupation)}
              helperText={touched.occupation && errors.occupation}
              sx={{ gridColumn: "span 4" }}
            />
            <FormControl sx={{ gridColumn: "span 4" }}>
              <Input
                id="my-input"
                aria-describedby="my-helper-text"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.avatar}
                name="avatar"
                style={{ display: "none" }}
              />
              <TextField
                label="Profile picture"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.filename}
                error={Boolean(errors.filename)}
                helperText={errors.filename}
                name="filename"
                autoComplete="off"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => ref.current?.click()}
                        sx={{
                          zIndex: 2,
                          padding: "0 1rem",
                          height: "2.5rem",
                          backgroundColor: controls,
                          color: controlsText,
                          "&:hover": { backgroundColor: hoveredControls },
                        }}
                      >
                        ADD
                        <input
                          ref={ref}
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleFileAddition(e, setFieldValue)}
                        />
                      </Button>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
            </FormControl>
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
                "&:hover": {
                  backgroundColor: hoveredControls,
                },
              }}
              onClick={handleButtonDisable}
            >
              {mutation.isLoading ? (
                <CustomCircularLoading
                  margin="0"
                  size="1rem"
                  color={mutation.isLoading ? hoveredControls : controls}
                  promptText="Registration..."
                  promptDirectionColumn={false}
                />
              ) : (
                "REGISTER"
              )}
            </Button>
          </Box>
          <Typography
            onClick={() => {
              handleAuthModeChange();
              resetForm();
            }}
            sx={{
              textDecoration: "underline",
              textAlign: "center",
              color: controls,
              "&:hover": {
                cursor: "pointer",
                color: hoveredControls,
              },
            }}
          >
            Already have an account? Login here.
          </Typography>
        </form>
      )}
    </Formik>
  );
};

export default RegisterForm;
