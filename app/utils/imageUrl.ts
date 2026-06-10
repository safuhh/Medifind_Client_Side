export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return "";
  
  if (path.startsWith("http")) {
    return path;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://newmedifinddeploy-env.eba-pp6njqrd.eu-north-1.elasticbeanstalk.com";
  

  const cleanPath = path.replace(/^(\/?uploads[/\\]|^\/)/, "");
  
  return `${baseUrl}/uploads/${cleanPath.replace(/\\/g, "/")}`;
};
