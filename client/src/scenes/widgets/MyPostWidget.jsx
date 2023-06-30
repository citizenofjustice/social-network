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
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendPost, editSelectedPost } from "API";
import { setEditablePost, triggerReloadToggle } from "state/postsSlice";
import "./MyPostWidget.module.css";

const MyPostWidget = ({ picturePath }) => {
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [postText, setPostText] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const editablePost = useSelector((state) => state.posts.editablePost);
  const dispatch = useDispatch();

  const handlePost = async () => {
    if (editablePost._id) {
      const formData = new FormData();
      console.log(editablePost.picturePath);
      console.log(image);
      if (
        editablePost.description !== postText ||
        (image !== undefined && image !== null)
      ) {
        formData.append("userId", _id);
        formData.append("description", postText);
        // if (image) {
        //   formData.append("picture", image);
        //   formData.append("picturePath", image.name);
        // }
        const response = await editSelectedPost(
          editablePost.postId,
          formData,
          token,
          _id
        );
        console.log(response);
      }
    } else {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", postText);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }
      await sendPost(formData, _id, token);
      dispatch(triggerReloadToggle());
      setImage(null);
      setPostText("");
    }
  };

  useEffect(() => {
    setPostText(editablePost.description);
    if (editablePost.picturePath) {
      setImage(editablePost.picturePath);
      setIsImage(true);
    }
    // dispatch(setEditablePost({editablePost: {}}));
  }, [editablePost]);

  // console.log(image);

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
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
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
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
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
