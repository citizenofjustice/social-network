import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendPost, editSelectedPost } from "API";
import { setEditablePost, triggerReloadToggle } from "state/postsSlice";
import "./MyPostWidget.module.css";

const MyPostWidget = ({ picturePath, isNonMobileScreens }) => {
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [postText, setPostText] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const editablePost = useSelector((state) => state.posts.editablePost);
  const dispatch = useDispatch();

  const handlePost = async () => {
    if (editablePost._id) {
      const formData = new FormData();
      if (
        editablePost.description !== postText ||
        (image !== undefined && image !== null)
      ) {
        appendFormInputs(formData);
        const response = await editSelectedPost(
          editablePost._id,
          formData,
          token,
          _id
        );
        console.log(response);
        dispatch(setEditablePost({ editablePost: {} }));
      } else {
        console.log("post has not changed");
        return;
      }
    } else {
      const formData = new FormData();
      appendFormInputs(formData);
      await sendPost(formData, _id, token);
    }
    clearForm();
    dispatch(triggerReloadToggle());
  };

  const appendFormInputs = (form) => {
    form.append("userId", _id);
    form.append("description", postText);
    if (image) {
      form.append("picture", image);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      setThumbnail(acceptedFiles.map((file) => URL.createObjectURL(file)));
      setImage(acceptedFiles[0]);
    },
    [setImage]
  );

  const clearForm = () => {
    setPostText("");
    setIsImage(false);
    setImage(null);
    setThumbnail(null);
  };

  useEffect(() => {
    const loadImgIntoThumbnail = async () => {
      const imgBlob = fetch(
        `${process.env.REACT_APP_API_URL}assets/${editablePost.picturePath}`
      )
        .then((response) => response.blob())
        .then((blob) => {
          return URL.createObjectURL(blob);
        });
      setIsImage(true);
      setThumbnail(await imgBlob);
    };

    if (editablePost._id) {
      setPostText(editablePost.description);
      if (editablePost.picturePath) {
        loadImgIntoThumbnail();
      }
    }
  }, [editablePost]);

  return (
    <WidgetWrapper mb="2rem">
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} loading={isUserLoading} />
        <InputBase
          placeholder="What's on your mind..."
          inputProps={{
            className: "add-post-input",
          }}
          onChange={(e) => setPostText(e.target.value)}
          value={postText}
          multiline={true}
          maxRows={5}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "1rem",
            padding: "1rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={onDrop}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!thumbnail ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Box display="block" margin="0 auto">
                        <img
                          src={thumbnail}
                          alt=""
                          style={{ borderRadius: "0.5rem", width: "100%" }}
                        />
                      </Box>
                      <EditOutlined sx={{ ml: "0.5rem" }} />
                    </FlexBetween>
                  )}
                </Box>
                {thumbnail && (
                  <IconButton
                    onClick={() => {
                      setImage(null);
                      setThumbnail(null);
                    }}
                    sx={{ ml: "0.5rem" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>
        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <>
            <FlexBetween gap="0.25px">
              <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
          </>
        )}

        <Button
          disabled={!postText}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
