import cloudinary from "../config/cloudinary.js";

// Upload an image buffer (from multer memoryStorage) to Cloudinary

export const uploadImage = (buffer, folder = "vibe-vault") =>
    new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                { folder, resource_type: "image" },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary full error:", error);
                        console.error("Cloudinary error details:", {
                            message: error.message,
                            http_code: error.http_code,
                            name: error.name,
                            cause: error.cause
                        });

                        return reject(error);
                    }

                    console.log(
                        "Cloudinary upload successful:",
                        result.secure_url
                    );

                    resolve(result);
                }
            )
            .end(buffer);
    });


// Delete an image from Cloudinary using its public_id
export const deleteImage = async (publicId) => {
    if (!publicId) return; // old or seeded products have no public_id, so there is nothing to delete
    await cloudinary.uploader.destroy(publicId);
};