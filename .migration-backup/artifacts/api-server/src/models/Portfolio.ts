import mongoose, { Document, Schema } from "mongoose";

export interface IPortfolio extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    category: { type: String, required: true },
    technologies: [{ type: String }],
    imageUrl: { type: String },
    demoUrl: { type: String },
    githubUrl: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

PortfolioSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret["id"] = ret["_id"].toString();
    delete ret["_id"];
    delete ret["__v"];
    return ret;
  },
});

export const Portfolio = mongoose.model<IPortfolio>(
  "Portfolio",
  PortfolioSchema,
);
