const multer = require('multer');
const path = require("path");
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

exports.imageUpload = async (req, res)=>{
    try {
        const storage = multer.diskStorage({
           destination: (req,file,cb)=>{
               cb(null, 'public/media');
           },
            filename: (req, file, cb)=>{
                const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExt = path.extname(file.originalname);
                cb(null, fileName+fileExt);
            }
        });
        const maxSize = 2 * 1024 * 1024; // max size 2MB
        const upload = multer({
           storage: storage,
            fileFilter: (req, file, cp)=>{
               // allow image extension
               const isFileType = file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp';
               if ( isFileType ){
                    cp(null, true);
               }else {
                   cp(null, false);
                   return cp(new Error('Only jpg, jpeg, png and webp format is allowed'));
               }
           },
            limits: maxSize
        }).array('photos', 5);

        upload(req, res, async (err)=>{
            // console.log("Request Body", req.body);
            // console.log("Request Files", req.files);

            const files = await imagemin(['public/media/*.{jpg,png,jpeg,webp}'], {
                destination: 'public/media',
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            });

            // console.log(files);
            res.download(files[0].destinationPath);

            if (err instanceof multer.MulterError){
                res.status(400).json({
                    status: "Fail",
                    error: err.message
                })
            }else if(err) {
                res.status(400).json({
                    status: "Fail",
                    error: err.message
                })
            }
        })

    }catch (err) {
        res.status(400).json({
            status: 'Fail',
            error: err.message
        })
    }
}