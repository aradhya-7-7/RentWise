const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const upload = require("../middlewares/upload.middleware");

router.post("/login", controller.login);

// multer for aadhaar file
router.post(
  "/register",
  upload.single("aadharFile"),
  controller.register
);

router.get("/test", (req, res) => {
  res.json({ message: "API connected successfully 🚀" });
});

module.exports = router;