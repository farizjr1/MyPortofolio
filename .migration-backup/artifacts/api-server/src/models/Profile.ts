import mongoose, { Document, Schema } from "mongoose";

interface IEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  description?: string;
}

interface IExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologies?: string[];
}

interface ISkill {
  id: string;
  name: string;
  category: string;
  level: number;
}

export interface IProfile extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  title: string;
  bio: string;
  email?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  education: IEducation[];
  experience: IExperience[];
  skills: ISkill[];
  tools: string[];
  expertiseAreas: string[];
  typewriterTitles: string[];
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    id: { type: String, required: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true },
    description: { type: String },
  },
  { _id: false },
);

const ExperienceSchema = new Schema<IExperience>(
  {
    id: { type: String, required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
    technologies: [{ type: String }],
  },
  { _id: false },
);

const SkillSchema = new Schema<ISkill>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: Number, min: 1, max: 100, required: true },
  },
  { _id: false },
);

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    avatarUrl: { type: String },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    websiteUrl: { type: String },
    education: [EducationSchema],
    experience: [ExperienceSchema],
    skills: [SkillSchema],
    tools: [{ type: String }],
    expertiseAreas: [{ type: String }],
    typewriterTitles: [{ type: String }],
  },
  { timestamps: true },
);

ProfileSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret["id"] = ret["_id"].toString();
    delete ret["_id"];
    delete ret["__v"];
    return ret;
  },
});

export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
