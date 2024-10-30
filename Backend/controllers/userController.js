const ErrorHandler = require('../utils/errorhandler');
const catchasyncError = require("../middleware/cattchasyncError");
const User = require("../models/user")
const sendToken = require("../utils/jwtToken")
const cloudinary= require("cloudinary")

// register user//

exports.registerUser = catchasyncError(async (req, res, next) => {

      const myCloud= await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
      })

    const { name, email, password } = req.body
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })

    sendToken(user, 201, res)
})


// Login user//

exports.loginUser = catchasyncError(async (req, res, next) => {
    const { email, password } = req.body

    // checking if user gives both password as well as email//

    if (!email || !password) {
        return next(new ErrorHandler("please enter email and password", 500))
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("invalid email or password", 500))
    }

    const isPasswordMatched = user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("invalid email or password", 500))
    }

    sendToken(user, 200, res)

})

// logout user//

exports.logout = catchasyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "loged out"
    })
})

// forget password//

exports.forgetPassword = catchasyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler("user not found", 404))
    }

    // get resetpassword token//
    const resetToken = user.resetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `your passwordreset token is :-\n\n ${resetPasswordUrl}\n\n if you have not requested this email, please ignore this`
})

// user details//

exports.getUserDetails = catchasyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

// update user password//

exports.updatePassword = catchasyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 401))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler(" password is incorrect", 400))
    }

    user.password = req.body.newPassword;

    await user.save()

    sendToken(user, 200, res)

})

// update user profilre//

exports.updateProfile = catchasyncError(async (req, res, next) => {


    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

})

// Get all user//
exports.getAllUser = catchasyncError(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})

// Getsingle user details for (admin)//
exports.getSingleUser = catchasyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(
            new ErrorHandler(`user does not exist with id: ${req.params.id}`)
        )
    }

    res.status(200).json({
        success: true,
        user
    })
})


// update user Role (admin)//

exports.updateUserRole = catchasyncError(async (req, res, next) => {


    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        success: true
    })
    if (!user) {
        return next(
            new ErrorHandler(`user does not exist with this id:${req.params.id}`)
        )
    }

    res.status(400).json({
        success: true
    })

})

// delete user Role (admin)//

exports.deleteUser = catchasyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(
            new ErrorHandler(`user does not exist with this id:${req.params.id}`)
        )
    }

    res.status(200).json({
        success: true
    })

})

// create product review or update review//
exports.createProductReview = catchasyncError(async (req, res, next) => {

    const { rating, comment, productId } = req.body

    const review = {
        name: req.user.name,
        user: req.user._id,
        rating: Number(rating),
        comment,
    }

    const Product = await Product.findById(productId)

    const isReviewed = Product.reviews.find(rev => rev.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        Product.reviews.forEach(rev => {
            if (rev => rev.user.toString() === req.user._id.toString())
            
                rev.rating = rating,
                    rev.comment = comment
        })
    }
    else {
        Product.reviews.push(review)
        Product.numOfViews.product.reviews.length   
    }

let avg=0
Product.ratings=Product.reviews.forEach(rev=>{
avg+=rev.rating
})
Product.ratings=avg
/Product.reviews.length

await Product.save({validateBeforeSave:false})

res.status(200).json|({
    success:true
})

})

 
// get all reviews//
exports.productReview = catchasyncError(async (req, res, next) => {

    const Product = await 
    Product.findById(req.query.id)

    if (!Product) {
        return next(
            new ErrorHandler(`user does not exist with this `,404)
        )
    }

    res.status(200).json({
        success: true,
        reviews:Product.review
    })

})

// delete review//

exports.deleteReview= catchasyncError(async (req, res, next) => {

    const Product = await Product.findById(req.query.productId)

    if (!Product) {
        return next(
            new ErrorHandler(`user does not exist  `,404)
        )
    }

   const reviews = Product.reviews.filter(
    (rev)=> rev._id.toString()!==req.query.id.toString()
   )

    let avg = 0
    reviews.forEach((rev) => {
        avg += rev.rating
    })
    const ratings = avg
        / reviews.length

        const noOfReviews=reviews.length

        await Product.findByIdAndUpdate(req.query.productId,{
            reviews,
            ratings,
            noOfReviews
        })

    res.status(200).json({
        success: true
    })

})
