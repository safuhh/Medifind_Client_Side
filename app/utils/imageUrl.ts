export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return "";
  
  if (path.startsWith("http")) {
    return path;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  

  const cleanPath = path.replace(/^(\/?uploads[/\\]|^\/)/, "");
  
  return `${baseUrl}/uploads/${cleanPath.replace(/\\/g, "/")}`;
};
