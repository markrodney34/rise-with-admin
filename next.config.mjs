// Pasted image URLs must come from an allowed host. Add more hosts here if you use other image sources.
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "risemayugesports.org", pathname: "/wp-content/uploads/**" }] },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }];
  },
};
export default nextConfig;
