const Order= require("../models/orderModels")
const Product = require('../models/productModel'); 
const ErrorHandler = require('../utils/errorhandler');
const catchasyncError = require("../middleware/cattchasyncError");

// creating new order//
exports.newOrder = catchasyncError(async(req,res,next)=>{

   const{
    shippingInfo,orderItems,paymentInfo,itemsPrice,textPrice,shippingPrice,totalPrice}
     =req.body

     const order= await Order.create({
         shippingInfo, 
         orderItems, 
         paymentInfo, 
         itemsPrice, 
         textPrice, 
         shippingPrice,
         totalPrice,
         paidAt:Date.now(),
         user:req.user._id 
     })
     
     res.status(200).json({
        success:true,
        order
     })
})

// get single order//

exports.getSingleOrder= catchasyncError(async(req,res,next)=>{

    const order= await Order.findById(req.params.id).populate("user","name email")

    if(!order){
        return next(
            new ErrorHandler("order not found this id",404)
        )
    }

    res.status(200).json({
        success:true,
        order
    })
})

// get loggedin user order//

exports.myOrder = catchasyncError(async (req, res, next) => {

    const orders = await Order.find({user:req.user._id})


    res.status(200).json({
        success: true,
        orders
    })
})


// get all orders admin//

exports.getAllOrder = catchasyncError(async (req, res, next) => {

    const orders = await Order.find()

    let totalAmount= 0

    orders.forEach((order)=>{
        totalAmount+=order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// get update orders admin//

exports.updateOrder = catchasyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(
            new ErrorHandler("order not found this id", 404)
        )
    }

   if(!order.orderStatus=== "delivered"){
    return next(
        new ErrorHandler("you have already delivered this order",404)
    )
   }

    order.orderItems.forEach(async(o)=>{
       await updateStock(o.product,o.quantity)
    })

    order.orderStatus=req.body.status

    if(req.body.status==="delivered"){
        order.deliveredAt=Date.now()
    }

    await order.save({validateBeforeSave:false})

    res.status(200).json({
        success: true,
        
    })
})

async function updateStock (id,quantity){
    const product= await Product.findById(id)

    product.Stock=quantity
   await product.save({validateBeforeSave: false})
}


// delete orders admin//

exports.deleteOrder = catchasyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(
            new ErrorHandler("order not found this id", 404)
        )
    }

    await order.remove()

 
    res.status(200).json({
        success: true,
        
    })
})
