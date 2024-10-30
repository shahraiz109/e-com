const mongoose= require("mongoose")

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true
    },
    description:{
        type:String,
        required: [true, "Please enter product description"]
    },
    price:{
        type:Number,
        required: [true, "Please enter product price"],
        maxLength:[8,"price cannont exceed 8 character"]
    },ratings:{
        type:Number,
        default:0
    },
    images:[
    {
        public_id:{
            type:String,
            required:true
        },
        url: {
            type: String,
            required: true
        }
    }
    ],
    category:{
        type:String,
        required:[true,"please enter product category"]
    },
    Stock:{
        type:Number,
        required:[true,"please enter product stock"],
        maxLength:[4,"Stock cannont exceed 4 character"],
        default:1
    },
    numOfViews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model("Products", productSchema)