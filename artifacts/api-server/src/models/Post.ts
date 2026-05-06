import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  readingTime: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    readingTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

PostSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title);
  }
  const words = this.content.split(/\s+/).length;
  this.readingTime = Math.max(1, Math.ceil(words / 200));
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

PostSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as Record<string, unknown>;
  if (update && typeof update === "object") {
    const title = (update as { title?: string }).title;
    if (title && !(update as { slug?: string }).slug) {
      (update as { slug?: string }).slug = slugify(title);
    }
    const content = (update as { content?: string }).content;
    if (content) {
      const words = String(content).split(/\s+/).length;
      (update as { readingTime?: number }).readingTime = Math.max(1, Math.ceil(words / 200));
    }
    const published = (update as { published?: boolean }).published;
    if (published && !(update as { publishedAt?: Date }).publishedAt) {
      (update as { publishedAt?: Date }).publishedAt = new Date();
    }
  }
  next();
});

PostSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret["id"] = ret["_id"].toString();
    delete ret["_id"];
    delete ret["__v"];
    return ret;
  },
});

export const Post = mongoose.model<IPost>("Post", PostSchema);
