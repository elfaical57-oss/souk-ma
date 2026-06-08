import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/sellers", "/register", "/login"],
        disallow: ["/dashboard/", "/profile", "/cart", "/chat"],
      },
    ],
    sitemap: "https://jemlamaroc.com/sitemap.xml",
  };
}
