export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return "/no-image.png";
  
  if (path.startsWith("http")) {
    return path;
  }
  
  // Legacy paths that were uploaded locally (e.g., uploads/filename.jpg)
  // are broken on the new Cloudinary setup since the files aren't on the server.
  // We return a default placeholder so the UI looks clean instead of broken.
  return "/no-image.png";
};
