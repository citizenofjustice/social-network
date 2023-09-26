import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

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
    const filedata = req.file;
    let picturePath = null;
    if (filedata) picturePath = `${userId}/${filedata.filename}`;
    const newPost = new Post({
      user: userId,
      description,
      picturePath,
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
    const { id, limit, pageNum } = req.params;
    const totalPostCount = await Post.find({ user: { $ne: id } })
      .sort({ createdAt: -1 })
      .count();
    const pagesCount = Math.ceil(totalPostCount / parseInt(limit));
    const postsPage = await Post.find({ user: { $ne: id } })
      .populate(postPopulateQuery)
      .sort({ createdAt: -1 })
      .skip(pageNum > 0 ? (pageNum - 1) * limit : 0)
      .limit(limit);
    res.status(200).json({ pagesCount, postsPage });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId, limit, pageNum } = req.params;
    const totalPostCount = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .count();
    const pagesCount = Math.ceil(totalPostCount / parseInt(limit));
    const postsPage = await Post.find({ user: userId })
      .populate(postPopulateQuery)
      .sort({ createdAt: -1 })
      .skip(pageNum > 0 ? (pageNum - 1) * limit : 0)
      .limit(limit);
    res.status(200).json({ pagesCount, postsPage });
  } catch (err) {
    res.status(404).json({ message: err.message });
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
    const filedata = req.file;
    const post = await Post.findById(postId);
    let resStatus = 200;
    let result;
    if (post.user.toString() === userId) {
      let picturePath = null;
      if (filedata) picturePath = `${userId}/${filedata.filename}`;
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };
      const updatePost = {
        $set: {
          description: description,
          picturePath: picturePath,
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

    await Comment.findByIdAndDelete({ _id: commentId });

    // const comment = post.comments.find(
    //   (comment) => comment._id.toString() === commentId
    // );
    // if (comment && comment.userId === userId) {
    //   const options = {
    //     upsert: false,
    //     returnDocument: "after",
    //     returnNewDocument: true,
    //   };
    //   const updatedComments = post.comments.filter(
    //     (comment) => comment._id.toString() !== commentId
    //   );
    //   const updatePost = {
    //     $set: {
    //       comments: updatedComments,
    //     },
    //   };
    //   result = await Post.findOneAndUpdate(
    //     { _id: postId },
    //     updatePost,
    //     options
    //   );
    // } else {
    //   resStatus = 403;
    //   result = null;
    // }
    res.status(resStatus).json([]);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
