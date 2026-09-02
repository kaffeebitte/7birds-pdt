import cloudinary from "../config/cloudinary.js";
import type { UploadApiResponse } from "cloudinary";

export function uploadProfileImageToCloudinary(
  buffer: Buffer,
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "7birds/profiles",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });
}

export function deleteProfileImageFromCloudinary(
  publicId: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (result.result !== "ok" && result.result !== "not found") {
          reject(new Error(`Cloudinary delete failed: ${result.result}`));
          return;
        }

        resolve();
      },
    );
  });
}
