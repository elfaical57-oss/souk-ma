import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/ar", "/products", "/sellers", "/register", "/login"],
        disallow: ["/dashboard/", "/profile", "/cart", "/chat", "/*?_rsc="],
      },
    ],
    sitemap: "https://jemlamaroc.com/sitemap.xml",
  };
}
