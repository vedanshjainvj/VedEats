import cloudinary from "../config/cloudinary.config";

const uploadImageOnCloudinary = async (file: Express.Multer.File) => {
    const base64Image = Buffer.from(file.buffer).toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64Image}`;
    const imageUrl = await cloudinary.uploader.upload(dataUri);
    return imageUrl.secure_url;
}

export default uploadImageOnCloudinary;