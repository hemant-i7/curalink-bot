import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  userId: string;
  hasCompletedInfo: boolean;
  personalInfo: {
    name?: string;
    age?: number;
    gender?: string;
    location?: string;
    phone?: string;
    email?: string;
    height?: number; // in cm
    weight?: number; // in kg
    bloodGroup?: string;
    occupation?: string;
  };
  medicalHistory: {
    conditions: string[]; // checkbox conditions like diabetes, hypertension, asthma
    medications: string[];
    allergies: string[];
    surgeries: string[];
    familyHistory: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  hasCompletedInfo: {
    type: Boolean,
    default: false
  },
  personalInfo: {
    name: String,
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    location: String,
    phone: String,
    email: String,
    height: Number, // in cm
    weight: Number, // in kg
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    occupation: String
  },
  medicalHistory: {
    conditions: [String], // diabetes, hypertension, asthma, etc.
    medications: [String],
    allergies: [String],
    surgeries: [String],
    familyHistory: [String]
  }
}, {
  timestamps: true
});

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);