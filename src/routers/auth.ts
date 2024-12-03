import { Router } from "express";
import AuthController from "../controllers/auth";
import {
    signupValidationSchema,
    loginValidationSchema,
} from "../utils/middleware/validator";
import { checkSchema } from "express-validator";
import { denyAuthUserFromAccessingUnprotectedRoutes } from "../utils/middleware/authenticateUser";

const router = Router();

router.post("/logout", AuthController.logoutUser);

router.use(denyAuthUserFromAccessingUnprotectedRoutes);
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

export { router as AuthRouter };
