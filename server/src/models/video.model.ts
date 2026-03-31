import mongoose, { Schema, model, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IVideo extends Document {
  // Basic Info
  title: string;
  description: string;
  tags: string[];
  category: string;
  language: string;
  recordingDate?: string;
  location?: string;
  duration?: number; // in seconds
  likecount?: number;
  dislikecount?: number;
  commentCount?: number;

  // Media
  videoFile: string;
  thumbnailUrl: string;

  // Audience
  madeForKids: boolean | null;
  ageRestricted: boolean;

  // Safety & Compliance
  containsViolence: boolean;
  containsBlood: boolean;
  containsWeapons: boolean;
  dangerousActs: boolean;
  mentalHealthTopics: boolean;
  selfHarmReferences: boolean;
  politicalContent: boolean;
  religiousContent: boolean;
  containsNudity: boolean;
  suggestiveContent: boolean;
  containsRealPeople: boolean;
  hasConsent: boolean;
  facesVisible: boolean;
  copyrightOwnership: boolean;

  // Visibility
  visibility: "public" | "private" | "unlisted";
  scheduleDate?: string;
  isPremiere: boolean;

  // Extra (recommended)
  user: mongoose.Types.ObjectId;
  views: number;
  //tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
const videoSchema = new Schema<IVideo>(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    tags: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      default :"Education"
    },

    language: {
      type: String,
      default: "en",
    },

    recordingDate: String,
    location: String,

    madeForKids: {
      type: Boolean,
      default: null,
    },

    ageRestricted: {
      type: Boolean,
      default: false,
    },

    containsViolence: { type: Boolean, default: false },
    containsBlood: { type: Boolean, default: false },
    containsWeapons: { type: Boolean, default: false },
    dangerousActs: { type: Boolean, default: false },
    mentalHealthTopics: { type: Boolean, default: false },
    selfHarmReferences: { type: Boolean, default: false },
    politicalContent: { type: Boolean, default: false },
    religiousContent: { type: Boolean, default: false },
    containsNudity: { type: Boolean, default: false },
    suggestiveContent: { type: Boolean, default: false },
    containsRealPeople: { type: Boolean, default: false },
    hasConsent: { type: Boolean, default: false },
    facesVisible: { type: Boolean, default: false },

    copyrightOwnership: {
      type: Boolean,
      default: false,
    },

    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },

    scheduleDate: String,

    isPremiere: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = model<IVideo>("Video", videoSchema);