import mongoose from "mongoose";

const StarPlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  achievement: { type: String, default: "" },
  sport: { type: String, default: "" },
  level: { type: String, enum: ["district", "state", "national"], default: "district" }
});

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, default: "" },
  division: { type: String, default: "" },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 }
});

const AcademySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  sport: { type: String, required: true },
  students: { type: Number, default: 0 },
  rating: { type: Number, default: 1 },
  city: { type: String, default: "Hyderabad, TG" },
  area: { type: String, default: "" },
  founded: { type: String, default: "" },
  coach: { type: String, default: "" },
  phone: { type: String, default: "" },
  status: { type: String, default: "active" },
  badge: { type: String, enum: ["founding", "verified", "premium", "listed"], default: "verified" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  matchesPlayed: { type: Number, default: 0 },
  trophies: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  topRank: { type: String, default: "" },
  starPlayers: [StarPlayerSchema],
  teams: [TeamSchema],
  
  // SEO fields
  description: { type: String, default: "" },
  metaTitle: { type: String, default: "" },
  photos: [{ type: String }],
  facilities: [{ type: String }],
  ageGroups: [{ type: String }],
  timing: { type: String, default: "" },
  feeRange: { type: String, default: "" },
  googleMapsUrl: { type: String, default: "" },
  socialLinks: {
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    facebook: { type: String, default: "" },
  },
});

// Auto-generate slug from name before saving
AcademySchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  this.updatedAt = new Date();
  next();
});

// Add text index for search
AcademySchema.index({ name: "text", sport: "text", area: "text", description: "text" });
AcademySchema.index({ sport: 1, status: 1 });
AcademySchema.index({ area: 1, status: 1 });

export default mongoose.models.Academy || mongoose.model("Academy", AcademySchema);
