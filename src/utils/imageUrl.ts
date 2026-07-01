export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return "";
  
  if (path.startsWith("http")) {
    return path;
  }
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://medifindapiii.duckdns.org/api";
  baseUrl = baseUrl.replace(/\/api\/?$/, "");

  const cleanPath = path.replace(/^(\/?uploads[/\\]|^\/)/, "");
  
  return `${baseUrl}/uploads/${cleanPath.replace(/\\/g, "/")}`;
};
