import { Router } from "express";
import AuthController from "../controllers/auth";
import {
    signupValidationSchema,
    loginValidationSchema,
} from "../utils/middleware/validator";
import { checkSchema } from "express-validator";

const router = Router();

router.get("/signup", AuthController.getSignupPage);
router.post(
    "/signup",
    checkSchema(signupValidationSchema),
    AuthController.createUser
);

router.get("/login", AuthController.getLoginPage);
router.post(
    "/login",
    checkSchema(loginValidationSchema),
    AuthController.loginUser
);
router.post("/logout", AuthController.logoutUser);

export { router as AuthRouter };
