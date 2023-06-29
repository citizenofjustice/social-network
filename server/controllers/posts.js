import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
      isEdited: false,
    });
    await newPost.save();

    const post = await Post.findOne(
      { userId },
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
    const totalPostCount = await Post.find({ userId: { $ne: id } })
      .sort({ createdAt: -1 })
      .count();
    const pagesCount = Math.ceil(totalPostCount / parseInt(limit));
    const postsPage = await Post.find({ userId: { $ne: id } })
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
    const totalPostCount = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .count();
    const pagesCount = Math.ceil(totalPostCount / parseInt(limit));
    const postsPage = await Post.find({ userId })
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
    console.log(req.body);
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
    const { postId, userId } = req.params;
    const { formData } = req.body;
    const post = await Post.findById(postId);
    let resStatus = 200;
    let result;
    if (post.userId === userId) {
      console.log("edited post: - ", formData);
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
    if (post.userId === userId) {
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
    if (post.userId === userId) {
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
