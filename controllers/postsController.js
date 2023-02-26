import mongoose from "mongoose";
import postMessage from "../models/postMessage.js";
import catchAsync from "../utils/catchAsync.js";
import appError from "../utils/appError.js";

export const getPosts = catchAsync(async (req, res, next) => {
  const { page } = req.query;

  const LIMIT = 8;
  const startIndex = (+page - 1) * LIMIT; // get starting index of every page
  const total = await postMessage.countDocuments({});
  const posts = await postMessage
    .find()
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startIndex);

  res.status(200).json({
    status: "success",
    data: posts,
    currentPage: +page,
    numberOfPages: Math.ceil(total / LIMIT),
    result: posts.length,
  });
});

export const getPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await postMessage.findById(id);

  res.status(200).json({
    status: "success",
    message: "Post detail found",
    data: post,
  });
});
export const getPostsBySearch = catchAsync(async (req, res, next) => {
  const { searchQuery, tags } = req.query;

  const title = new RegExp(searchQuery, "i");

  const posts = await postMessage.find({
    $or: [{ title }, { tags: { $in: tags.split(",") } }],
  });

  res.status(200).json({
    status: "success",
    message: "searched Posts found",
    data: posts,
  });
});

export const createPost = catchAsync(async (req, res, next) => {
  const postData = req.body;

  const newPost = await postMessage.create({
    ...postData,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    status: "success",
    message: "Post Created",
    data: newPost,
  });
});

export const updatePost = catchAsync(async (req, res, next) => {
  const { id: _id } = req.params;

  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return next(new appError("Post not Found", 404));
  }

  const updatedPost = await postMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json({
    status: "success",
    message: "Post Updated",
    data: updatedPost,
  });
});

export const deleteAllPosts = catchAsync(async (req, res, next) => {
  await postMessage.deleteMany();

  res.json({
    status: "success",
    message: "Posts deleted",
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return next(new appError("No memory found with this ID", 404));
  }

  await postMessage.findByIdAndDelete(_id);

  res.status(200).json({
    status: "success",
    message: "Post Deleted",
  });
});

export const likePost = catchAsync(async (req, res, next) => {
  const { id: _id } = req.params;

  if (!req.userId) {
    return next(new appError("Unauthorized action", 401));
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return next(new appError("No memory found with this ID", 404));
  }

  const post = await postMessage.findById(_id);

  const index = post.likes.findIndex((id) => id === req.userId.toString());

  if (index === -1) {
    post.likes.push(req.userId.toString());
  } else {
    post.likes = [...post.likes.filter((id) => id !== req.userId.toString())];
  }

  const updatedPost = await postMessage.findByIdAndUpdate({ _id }, post, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: "Post like updated",
    updatedPost,
  });
});

export const commentPost = catchAsync(async (req, res, next) => {
  console.log("route comment reached");
  const { id } = req.params;
  const { value } = req.body;

  // console.log(id, value);

  const post = await postMessage.findById(id);
  post.comments.push(value);

  const updatedPost = await postMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  console.log(updatedPost);

  res.json(updatedPost);
});
