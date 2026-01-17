import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ["res.cloudinary.com"],
		// Disable Next's built-in image optimizer when running on environments
		// like Cloudflare Workers where the optimizer route (/ _next/image)
		// isn't available. This lets the browser load external images directly.
		unoptimized: true,
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
