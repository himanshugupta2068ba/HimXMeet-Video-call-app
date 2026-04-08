import { Router } from "express";
import { addToHistory, completeHistory, getProfile, getUserHistory, login, register,} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(addToHistory);
router.route("/complete_activity").post(completeHistory);
router.route("/get_all_activity").get(getUserHistory);
router.route("/profile").get(getProfile);

export default router;