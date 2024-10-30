const express = require("express")
const { registerUser, loginUser, logout,
     getUserDetails, updatePassword,
      updateProfile, getAllUser,
       getSingleUser, updateUserRole,
        deleteUser, 
        createProductReview,
        productReview,
        deleteReview} = require("../controllers/userController")
const { isAuntheticatedUser, authorizeRole } = require("../middleware/auth")
const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)
router.route("/me").get(isAuntheticatedUser, getUserDetails)
router.route("/password/update").put(isAuntheticatedUser, updatePassword)
router.route("/me/update").put(isAuntheticatedUser, updateProfile)
router.route("/admin/users").get(isAuntheticatedUser, authorizeRole("admin"), getAllUser)
router.route("/admin/user/:id")
    .get(isAuntheticatedUser, authorizeRole("admin"), getSingleUser)
    .put(isAuntheticatedUser, authorizeRole("admin"), updateUserRole)
    .delete(isAuntheticatedUser, authorizeRole("admin"), deleteUser)

    router.route("/review").put(isAuntheticatedUser,createProductReview)
    router.route("/reviews").get(productReview).delete(isAuntheticatedUser,deleteReview)

module.exports = router