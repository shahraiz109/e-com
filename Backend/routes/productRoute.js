const express= require("express")
const { getAllProducts,createProduct, updateProduct, deleteProduct, productDetail } = require("../controllers/productController")
const { isAuntheticatedUser,authorizeRole } = require("../middleware/auth")


const router=express.Router()

router.route("/product").get( getAllProducts)
router.route("/product/new").post(createProduct)
router.route("/product/:id")
    .put(updateProduct,  isAuntheticatedUser)
    .delete(deleteProduct, isAuntheticatedUser)
router.route("/product/:id").get(productDetail)

module.exports=router