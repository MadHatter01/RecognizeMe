const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const path = require('path')
const cors = require('cors')
AWS.config.update({ region: 'us-west-1' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage });



const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
// Testing AWS Code 
// s3.listBuckets((err, data) => {
//   if (err) {
//     console.error('Error listing buckets:', err);
//   } else {
//     console.log('S3 buckets:', data.Buckets);
//   }
// });

app.post('/upload', upload.single('image'), async(req, res)=>{
    try{
        const file = req.file;
        const filePath = file.path;

        const image = fs.readFileSync(filePath);
        const params = {
            Bucket : '',
            Key: file.filename,
            Body: image
        }
   
        const analyzeParams = {
            Image: {Bytes:image},
            Attributes:['ALL']
        }
        await s3.upload(params).promise();
       

        // res.json({success:true, message: 'Image uploaded successfully'})

        const imageResult = await rekognition.detectFaces(analyzeParams).promise();
        fs.unlinkSync(filePath);
        console.log(imageResult)
        res.json({success:true, faces:imageResult.FaceDetails});


    }
    catch (err){
        console.error('Upload error: ', err);
        res.status(500).json({success:false, message:'Failed to upload image'})
    }
})
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
