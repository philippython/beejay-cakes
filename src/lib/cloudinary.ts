export class CloudinaryUploadError extends Error {}

/** Uploads one file to Cloudinary and returns its secure URL. Throws
 *  CloudinaryUploadError with a message safe to show the admin directly
 *  (e.g. "Cloudinary is not configured on the server"). */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const sigRes = await fetch("/api/admin/cloudinary-signature", { method: "POST" });
  const sig = await sigRes.json();
  if (!sigRes.ok) {
    throw new CloudinaryUploadError(sig.error ?? "Could not get an upload signature");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const uploaded = await uploadRes.json();

  if (!uploadRes.ok) {
    throw new CloudinaryUploadError(uploaded.error?.message ?? "Upload to Cloudinary failed");
  }

  return uploaded.secure_url as string;
}
