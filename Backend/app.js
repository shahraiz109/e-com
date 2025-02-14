const express= require('express')

const app= express();

const cookieParser= require("cookie-parser")
const bodyParser= require("body-parser")
const fileUpload= require("express-fileupload")

const errorMiddleware= require("./middleware/error")



app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())

// routes import// 

const product= require("./routes/productRoute")
const user=require("./routes/userRoute")
const order=require("./routes/orderRouter")

app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("api/v1",order)

// middleware errors//

app.use(errorMiddleware)


module.exports=app