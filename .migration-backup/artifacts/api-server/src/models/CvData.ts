import mongoose, { Document, Schema } from "mongoose";

interface ICvPersonal {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

interface ICvEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

interface ICvExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  bullets: string[];
}

interface ICvSkillGroup {
  id: string;
  category: string;
  skills: string[];
}

interface ICvCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

interface ICvLanguage {
  id: string;
  name: string;
  proficiency: string;
}

export interface ICvData extends Document {
  _id: mongoose.Types.ObjectId;
  label: string;
  personal: ICvPersonal;
  education: ICvEducation[];
  experience: ICvExperience[];
  skillGroups: ICvSkillGroup[];
  certifications: ICvCertification[];
  languages: ICvLanguage[];
  createdAt: Date;
  updatedAt: Date;
}

const PersonalSchema = new Schema<ICvPersonal>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    website: String,
    summary: String,
  },
  { _id: false },
);

const CvSchema = new Schema<ICvData>(
  {
    label: { type: String, required: true },
    personal: { type: PersonalSchema, required: true },
    education: { type: Schema.Types.Mixed, default: [] },
    experience: { type: Schema.Types.Mixed, default: [] },
    skillGroups: { type: Schema.Types.Mixed, default: [] },
    certifications: { type: Schema.Types.Mixed, default: [] },
    languages: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true },
);

CvSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret["id"] = ret["_id"].toString();
    delete ret["_id"];
    delete ret["__v"];
    return ret;
  },
});

export const CvData = mongoose.model<ICvData>("CvData", CvSchema);
