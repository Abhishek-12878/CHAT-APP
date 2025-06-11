// backend/routes/chatRoutes.js
const express = require("express");
// const { chats } = require("../data/data");
const {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}=require("../controllers/chatControllers")
const {protect}=require("../middleware/authMiddleware")

const router = express.Router();

// router.route("/").post(protect, accessChat);
// router.route("/").get(protect, fetchChats);
router.route("/")
  .get(protect, fetchChats)
  .post(protect, accessChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

// router.get("/", (req, res) => {
//   res.send(chats);
// });

module.exports = router;
