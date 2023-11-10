const { Schema } = mongoose;
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    picturePath: {
      type: Object,
      default: {
        sourceUrl: { type: String, default: "" },
        placeholderUrl: { type: String, default: "" },
      },
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    posts: {
      type: Array,
      default: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    },
    socials: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const { keyValue } = error;
    next(new Error(`User with email "${keyValue.email}" already exists.`));
  } else {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
