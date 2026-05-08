export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return "";
  
  // If it's already a full URL (Cloudinary or absolute path), return it
  if (path.startsWith("http")) {
    return path;
  }

  // Otherwise, prepend the local backend URL and clean up any redundant /uploads/ prefix
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const cleanPath = path.replace(/^\/?uploads\//, "");
  return `${baseUrl}/uploads/${cleanPath}`;
};
