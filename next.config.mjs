// Pasted image URLs must come from an allowed host. Add more hosts here if you use other image sources.
const nextConfig = { images: { remotePatterns: [{ protocol: "https", hostname: "risemayugesports.org", pathname: "/wp-content/uploads/**" }] }, experimental: { serverActions: { bodySizeLimit: "12mb" } } };
export default nextConfig;
