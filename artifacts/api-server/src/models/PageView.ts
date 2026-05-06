import mongoose, { Document, Schema } from "mongoose";

export interface IPageView extends Document {
  path: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  country?: string;
  sessionId: string;
  createdAt: Date;
}

const PageViewSchema = new Schema<IPageView>(
  {
    path: { type: String, required: true, index: true },
    referrer: { type: String },
    userAgent: { type: String },
    ip: { type: String },
    country: { type: String },
    sessionId: { type: String, required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// TTL: auto-delete records older than 90 days
PageViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

PageViewSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret["id"] = ret["_id"].toString();
    delete ret["_id"];
    delete ret["__v"];
    return ret;
  },
});

export const PageView = mongoose.model<IPageView>("PageView", PageViewSchema);
