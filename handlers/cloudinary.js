const cloudinary = require('cloudinary')
// cloudinary to save profile picture of employee
cloudinary.config({
  cloud_name: process.env.cloudSecret,
  api_key: process.env.cloudKey,
  api_secret: process.env.cloudAppSecret
})