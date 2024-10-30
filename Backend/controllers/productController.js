const Product = require('../models/productModel'); // Import your Product model
const ErrorHandler = require('../utils/errorhandler');
const catchasyncError= require("../middleware/cattchasyncError");
const ApiFeatures = require('../utils/apiFeature');

exports.createProduct = catchasyncError(
    async (req, res, next) => {


req.boy.user=req.user.id
        const newProduct = await Product.create(req.body); // Creating a new product using the Product model
        res.status(201).json({
            Product: newProduct // Sending the created product in the response
        });

    }
)

// get all product//
exports.getAllProducts =catchasyncError( async (req,res)=>{
    const resultPerPage=8
    const productsCount= await Product.countDocuments()
    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search().filter().pagination(resultPerPage)
    const products= await apiFeature.query
    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage
    })
})

// product details//
exports.productDetail =catchasyncError( async(req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("product not found", 500))
       
    }
    await product.deleteOne()
    res.status(200).json({
        success: true,
        product,
        
    })
})

// update product//

exports.updateProduct=catchasyncError( async(req,res,next)=>{
    let product= await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("product not found", 500))

    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body)

    res.status(200).json({
        success:true,
        product
    })
})

// delete product//

exports.deleteProduct=catchasyncError( async(req,res,next)=>{
    const product=await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("product not found", 500))

    }
    await product.deleteOne()
    res.status(200).json({
        success:true,
        message:"product deleted"
    })
})