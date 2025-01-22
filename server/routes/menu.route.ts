import express from "express" 

// --------------- IMPORTING OTHER FILES ---------------
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addMenu,editMenu, getAllMenus } from "../controllers/menu.controller";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("image"), addMenu);
router.route("/get-all").get(isAuthenticated, getAllMenus);
router.route("/:id").put(isAuthenticated, upload.single("image"), editMenu);
 
export default router;


