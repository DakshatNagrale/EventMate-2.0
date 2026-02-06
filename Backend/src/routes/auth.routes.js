import express from "express";
import {registerUser, loginUser} from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/logout', (req, res)=>{
    return res.status(200).json({
        message: "Logout successful, Please remove token from client"
    })
})

export default router;