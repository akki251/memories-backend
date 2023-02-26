import express from "express";

auth;

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  deleteAllPosts,
  likePost,
  getPostsBySearch,
  getPost,
  commentPost,
} from "../controllers/postsController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/search", getPostsBySearch);
router.route("/").get(getPosts);
router.route("/:id").get(getPost);

// only authenticated user can access
router.use(auth);

router.route("/").post(createPost).delete(deleteAllPosts);
router.route("/:id").patch(updatePost).delete(deletePost);
router.route("/like/:id").patch(likePost);
router.route("/:id/commentPost").post(commentPost);
export default router;
