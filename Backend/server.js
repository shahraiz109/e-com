const app= require('./app')

const dotenv= require("dotenv")
const cloudinary= require("cloudinary")

const connectDatabase= require("./config/database")

// Config

dotenv.config({path:"config/config.env"})

// connecting to database

connectDatabase()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})