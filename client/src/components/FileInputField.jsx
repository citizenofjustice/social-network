import { AttachFile, CloseOutlined } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useRef } from "react";

const FileInputField = ({
  wrapperStyle,
  fileFieldName,
  fileValues,
  filenameValues,
  errors,
  formikProps,
}) => {
  const ref = useRef();

  const handleFileAddition = (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    const [file] = files;
    if (!file) return;
    setFieldValue("filename", file.name);
    setFieldValue(fileFieldName, file);
  };

  return (
    <FormControl sx={wrapperStyle}>
      <Input
        id="my-input"
        aria-describedby="my-helper-text"
        onBlur={formikProps.handleBlur}
        onChange={formikProps.handleChange}
        value={fileValues}
        name={fileFieldName}
        style={{ display: "none" }}
      />
      <TextField
        label="Profile picture (optional)"
        onBlur={formikProps.handleBlur}
        onChange={formikProps.handleChange}
        value={filenameValues}
        error={Boolean(errors)}
        helperText={errors}
        name="filename"
        autoComplete="off"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {fileValues && (
                <IconButton
                  onClick={() => {
                    formikProps.setFieldValue(fileFieldName, "");
                    formikProps.setFieldValue("filename", "");
                    setTimeout(() => {
                      formikProps.setFieldTouched("filename");
                    });
                  }}
                >
                  <CloseOutlined />
                </IconButton>
              )}
              <IconButton onClick={() => ref.current?.click()}>
                <AttachFile />
              </IconButton>
              <input
                ref={ref}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  handleFileAddition(e, formikProps.setFieldValue)
                }
              />
            </InputAdornment>
          ),
          readOnly: true,
        }}
      />
    </FormControl>
  );
};

export default FileInputField;
