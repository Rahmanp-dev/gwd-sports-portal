import dbConnect from "@/lib/db";
import Academy from "@/models/Academy";

const BASE_URL = "https://sports.gwdglobal.in";

const SPORTS = ["cricket", "football", "badminton", "tennis", "swimming", "mma", "kabaddi"];
const AREAS = [
  "kukatpally", "kphb", "gachibowli", "madhapur", "kondapur",
  "miyapur", "jubilee-hills", "hitec-city", "bachupally", "madinaguda"
];

export default async function sitemap() {
  await dbConnect();
  const academies = await Academy.find({ status: "active" }).lean();

  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/find-academy`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  // Academy pages
  const academyPages = academies.map((a) => {
    const slug = a.slug || a.id || a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    return {
      url: `${BASE_URL}/academy/${slug}`,
      lastModified: a.updatedAt || a.createdAt || now,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  // Sport pages
  const sportPages = SPORTS.map((sport) => ({
    url: `${BASE_URL}/sport/${sport}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Area pages
  const areaPages = AREAS.map((area) => ({
    url: `${BASE_URL}/area/${area}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...academyPages, ...sportPages, ...areaPages];
}
