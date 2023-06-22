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

    const post = await Post.find();
    const sortPostByNew = post.sort((a, b) => b.createdAt - a.createdAt);
    res.status(201).json(sortPostByNew);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const { id, limit, pageNum } = req.params;
    const totalPostCount = await Post.find({ userId: { $ne: id } }).count();
    const pagesCount = Math.ceil(totalPostCount / limit);
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
    const limit = 3;
    const { userId, pageNum } = req.params;
    const totalPostCount = await Post.find({ userId: { $ne: id } }).count();
    const pagesCount = Math.ceil(totalPostCount / limit);
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
