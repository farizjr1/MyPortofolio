import mongoose, { Document, Schema } from "mongoose";

export type ContentSection =
  | "home"
  | "about"
  | "contact"
  | "services"
  | "testimonials"
  | "custom";

export interface IContent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  body: string;
  section: ContentSection;
  published: boolean;
  order: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    section: {
      type: String,
      required: true,
      enum: ["home", "about", "contact", "services", "testimonials", "custom"],
    },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

ContentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret["id"] = ret["_id"].toString();
    delete ret["_id"];
    delete ret["__v"];
    return ret;
  },
});

export const Content = mongoose.model<IContent>("Content", ContentSchema);
