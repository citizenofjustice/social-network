import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { uploadPictureAndGetUrl } from "../index.js";

const postPopulateQuery = [
  { path: "user", select: "firstName lastName location picturePath" },
  {
    path: "comments",
    select: "author content createdAt",
    populate: { path: "author", select: "firstName lastName picturePath" },
  },
];

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    let picturePath;
    let aspectRatio;
    if (!req.file) {
      picturePath = null;
      aspectRatio = null;
    } else {
      const imageData = await uploadPictureAndGetUrl(req.file);
      picturePath = {
        sourceUrl: imageData.sourceUrl,
        placeholderUrl: imageData.placeholderUrl,
      };
      aspectRatio = imageData.sourceAspectRatio;
    }
    const newPost = new Post({
      user: userId,
      description,
      picturePath: picturePath,
      aspectRatio: aspectRatio,
      likes: {},
      comments: [],
      isEdited: false,
    });
    await newPost.save();

    const post = await Post.findOne(
      { user: userId },
      {},
      { sort: { createdAt: -1 } }
    );
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const { id, limit, timestamp, pageNum } = req.params;
    const totalPostCount = await Post.find({
      user: { $ne: id },
      createdAt: { $lte: timestamp },
    })
      .sort({ createdAt: -1 })
      .count();
    const pagesCount = Math.ceil(totalPostCount / parseInt(limit));
    const postsPage = await Post.find({
      user: { $ne: id },
      createdAt: { $lte: timestamp },
    })
      .populate(postPopulateQuery)
      .sort({ createdAt: -1 })
      .skip(pageNum > 0 ? (pageNum - 1) * limit : 0)
      .limit(limit);
    res.status(200).json({ pagesCount, postsPage });
  } catch (err) {
    res.status(404).json(err);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId, timestamp, limit, pageNum } = req.params;
    const totalPostCount = await Post.find({
      user: userId,
      createdAt: { $lte: timestamp },
    })
      .sort({ createdAt: -1 })
      .count();
    const pagesCount = Math.ceil(totalPostCount / parseInt(limit));
    const postsPage = await Post.find({
      user: userId,
      createdAt: { $lte: timestamp },
    })
      .populate(postPopulateQuery)
      .sort({ createdAt: -1 })
      .skip(pageNum > 0 ? (pageNum - 1) * limit : 0)
      .limit(limit);
    res.status(200).json({ pagesCount, postsPage });
  } catch (err) {
    res.status(404).json(err);
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, description } = req.body;
    const post = await Post.findById(postId);
    let resStatus = 200;
    let result;
    if (post.user.toString() === userId) {
      let picturePath;
      let aspectRatio;
      if (!req.file) {
        picturePath = null;
        aspectRatio = null;
      } else {
        const imageData = await uploadPictureAndGetUrl(req.file);
        picturePath = {
          sourceUrl: imageData.sourceUrl,
          placeholderUrl: imageData.placeholderUrl,
        };
        aspectRatio = imageData.sourceAspectRatio;
      }
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };
      const updatePost = {
        $set: {
          description: description,
          picturePath: picturePath,
          aspectRatio: aspectRatio,
          isEdited: true,
        },
      };
      await Post.updateOne({ _id: postId }, updatePost, options);

      result = "edit complete";
    } else {
      resStatus = 403;
      result = "Access denied";
    }
    res.status(resStatus).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const removePost = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const post = await Post.findById(postId);
    let resStatus = 200;
    let result = "Delete successful";
    if (post.user.toString() === userId) {
      await Post.deleteOne({ _id: post._id });
    } else {
      resStatus = 403;
      result = "Access denied";
    }
    res.status(resStatus).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPostEditData = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const post = await Post.findById(postId);
    let resStatus = 200;
    let result;
    if (post.user.toString() === userId) {
      result = post;
    } else {
      resStatus = 403;
      result = "Access denied";
    }
    res.status(resStatus).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addNewComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, commentText } = req.body;
    const newComment = new Comment({
      post: postId,
      author: userId,
      content: commentText,
    });

    const addedComment = await newComment.save();
    const post = await Post.findById(postId);
    post.comments.push(addedComment);
    await post.save();

    const updatedPost = await post.populate(postPopulateQuery);

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const removePostComment = async (req, res) => {
  try {
    const { postId, commentId, userId } = req.params;

    const removableComment = await Comment.findOneAndDelete({
      _id: commentId,
    });
    if (!removableComment) {
      return res.status(400).send("Comment not found");
    }
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: commentId } },
      { returnDocument: "after" }
    );
    const result = await updatedPost.populate(postPopulateQuery);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getСertainPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId }).populate(
      postPopulateQuery
    );
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
