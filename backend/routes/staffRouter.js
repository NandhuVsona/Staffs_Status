const express = require("express");
const {
  isLogin,
  homePage,
  signupPage,
  singin,
  home,
  getAllStaffs,
  getAllStaffsData,
  overview,
  getStaff,
  logout,
  accountPage,
  getAccount,
  updateStatus,
  dashboardPage,
  aggregation,
} = require("../controllers/staffController");
const router = express.Router();

//GET ROUTES

router.get("/signup", signupPage);
router.get("/api/v1/staffs",getAllStaffs);
router.get("/api/v2/staffs",getAllStaffsData);
router.get("/overview/:id", isLogin, overview);
router.get("/api/v1/overview/:id", isLogin, getStaff);
router.get("/logout", logout);
router.get("/myaccount", isLogin, accountPage);
router.get("/account/:id", isLogin, getAccount);
router.get("/dashboard", isLogin, dashboardPage);
router.get("/api/v1/dashboard", isLogin, aggregation);
router.get("/",isLogin, homePage)

//POST ROUTES
router.post("/home", home);
router.post('/',singin);

//PATCH ROUTES
router.patch("/myaccount/:id", updateStatus);

module.exports = router