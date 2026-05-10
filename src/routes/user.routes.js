const express = require("express");
const { registerUser, loginUser } = require("../controllers/user.controller");
const { validateRegister, validateLogin } = require("../validations/user.validations");
const multer = require('multer');
const requireAuth = require("../middlewares/require-auth");
const UserModel = require("../models/user.model");
const { upload_avatar } = require("../middlewares/upload");

const router = express.Router();

router.post('/add-avatar', requireAuth, upload_avatar.single("image"), async (req, res) => {
    try {
        const userId = req.user._id;

        const imageUrl = req.file.path;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { avatar: imageUrl },
            { new: true }
        );

        console.log(imageUrl);

        res.status(200).json({
            message: "Avatar uploaded successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Upload failed" });
    }
});

router.post('/sign-up', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);


module.exports = router;