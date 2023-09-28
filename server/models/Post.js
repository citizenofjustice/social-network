const { Schema } = mongoose;
import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: String,
    picturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre("deleteOne", { query: true }, async function (next) {
  try {
    const postId = this._conditions._id;
    const commentSchema = mongoose.model("Comment").schema;
    const Comment = mongoose.model("Comment", commentSchema);
    await Comment.deleteMany({ post: postId }).exec();
  } catch (err) {
    console.log(err);
  }
  next();
});

const Post = mongoose.model("Post", postSchema);
export default Post;
