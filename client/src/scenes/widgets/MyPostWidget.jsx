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
  IconButton,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendPost, editSelectedPost } from "API";
import { setEditablePost } from "state/postsSlice";
import "./MyPostWidget.module.css";
import DefaultUserIcon from "components/DefaultUserIcon";
import CustomButton from "components/CustomButton";
import { useMutation, useQueryClient } from "react-query";

const MyPostWidget = ({
  firstName,
  lastName,
  picturePath,
  isNonMobileScreens,
}) => {
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [postText, setPostText] = useState("");
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isUserLoading = useSelector((state) => state.auth.isUserLoading);
  const editablePost = useSelector((state) => state.posts.editablePost);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { palette } = useTheme();
  const { controls, text, inputsBackground } = palette.custom;

  const handlePost = async () => {
    if (editablePost._id) {
      const formData = new FormData();
      if (
        editablePost.description !== postText ||
        (image !== undefined && image !== null)
      ) {
        appendFormInputs(formData);
        editPostMutation.mutate(formData);
        dispatch(setEditablePost({ editablePost: {} }));
      } else {
        console.log("post has not changed");
        return;
      }
    } else {
      const formData = new FormData();
      appendFormInputs(formData);
      sendPostMutation.mutate(formData);
    }
    clearForm();
  };

  const sendPostMutation = useMutation({
    mutationFn: async (formData) => {
      const postData = await sendPost(formData, _id, token);
      return postData;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: "posts" });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const editPostMutation = useMutation({
    mutationFn: async (formData) => {
      const editedPost = await editSelectedPost(
        editablePost._id,
        formData,
        token,
        _id
      );
      return editedPost;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: "posts" });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const handleEditCancelation = () => {
    dispatch(setEditablePost({ editablePost: {} }));
    clearForm();
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
    const abortController = new AbortController();
    const loadImgIntoThumbnail = async () => {
      const imgBlob = fetch(editablePost.picturePath.sourceUrl, {
        signal: abortController.signal,
      })
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

    return () => {
      abortController.abort();
    };
  }, [editablePost]);

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <Box>
          {picturePath ? (
            <UserImage image={picturePath} loading={isUserLoading} />
          ) : (
            <DefaultUserIcon
              firstNameInitial={firstName[0]}
              lastNameInitial={lastName[0]}
              fontSize="1.5rem"
            />
          )}
        </Box>
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
            backgroundColor: inputsBackground,
            borderRadius: "1rem",
            padding: "1rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${inputsBackground}`}
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
                  border={`2px dashed ${controls}`}
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
                          alt="thumbnail"
                          style={{
                            borderRadius: "0.5rem",
                            width: "100%",
                            maxHeight: "7rem",
                          }}
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
                      setIsImage(false);
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

      <Divider sx={{ margin: "1.25rem 0 0.5rem 0" }} />

      <FlexBetween padding="0 1rem">
        <FlexBetween
          sx={{
            padding: "0.5rem",
            "&:hover": { cursor: "pointer" },
          }}
          gap="0.25rem"
          onClick={() => setIsImage(!isImage)}
        >
          <ImageOutlined sx={{ color: text }} />
          <Typography
            sx={{
              color: text,
            }}
          >
            Image
          </Typography>
        </FlexBetween>
        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: text }} />
              <Typography color={text}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: text }} />
              <Typography color={text}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: text }} />
              <Typography color={text}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <>
            <FlexBetween gap="0.25px">
              <MoreHorizOutlined sx={{ color: text }} />
            </FlexBetween>
          </>
        )}
        <Box>
          {editablePost._id && (
            <CustomButton onClick={handleEditCancelation} margin="0 0.5rem 0 0">
              Cancel
            </CustomButton>
          )}
          <CustomButton
            disabled={!postText}
            onClick={handlePost}
            width="fit-content"
          >
            POST
          </CustomButton>
        </Box>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
