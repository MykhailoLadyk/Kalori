import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

/**
 * Checks if the current environment is running inside native Capacitor (Android/iOS).
 */
export function isNativeMobile() {
  return Capacitor.isNativePlatform();
}

/**
 * Normalizes photo output from Capacitor Camera to a reliable data URL string.
 */
export function photoToDataUrl(photo) {
  if (!photo) return null;
  if (photo.dataUrl) return photo.dataUrl;
  if (photo.base64String) {
    const format = photo.format || "jpeg";
    return `data:image/${format};base64,${photo.base64String}`;
  }
  if (photo.webPath) {
    return photo.webPath;
  }
  return null;
}

/**
 * Opens the native camera and captures a photo.
 * Returns the image data URL (base64) or null if the user cancelled.
 */
export async function capturePhotoFromCamera() {
  try {
    const photo = await Camera.getPhoto({
      quality: 85,
      width: 1200,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      saveToGallery: false,
      correctOrientation: true,
    });
    return photoToDataUrl(photo);
  } catch (err) {
    if (err?.message?.includes("cancelled") || err?.message?.includes("User cancelled")) {
      return null;
    }
    console.warn("Camera capture error:", err);
    throw err;
  }
}

/**
 * Opens the native gallery/photos picker to select a photo.
 * Returns the image data URL (base64) or null if the user cancelled.
 */
export async function pickPhotoFromGallery() {
  try {
    const photo = await Camera.getPhoto({
      quality: 85,
      width: 1200,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      correctOrientation: true,
    });
    return photoToDataUrl(photo);
  } catch (err) {
    if (err?.message?.includes("cancelled") || err?.message?.includes("User cancelled")) {
      return null;
    }
    console.warn("Gallery pick error:", err);
    throw err;
  }
}
