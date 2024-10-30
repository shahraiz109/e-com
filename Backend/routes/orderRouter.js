const express= require("express")
const{
    newOrder,
     getSingleOrder, 
     myOrder,
      getAllOrder, 
      updateOrder, 
      deleteOrder}=require("../controllers/orderController")

const { isAuntheticatedUser, authorizeRole } = require("../middleware/auth")

const router=express.Router()

router.route("/order/new").post(isAuntheticatedUser,newOrder)
router.route("/order/:id").get(isAuntheticatedUser,getSingleOrder)
router.route("/orders/me").get(isAuntheticatedUser,myOrder)
router.route("admin/orders").get(isAuntheticatedUser,authorizeRole("admin"),getAllOrder)
router.route("admin/orders").put(isAuntheticatedUser, authorizeRole("admin"),updateOrder)
.delete(isAuntheticatedUser,authorizeRole("admin"),deleteOrder)



module.exports=router
