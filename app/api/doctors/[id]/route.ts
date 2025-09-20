import { NextRequest, NextResponse } from "next/server"
import { Doctor } from "../route"

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    specialization: "Cardiologist",
    experience: "15 years",
    rating: 4.9,
    consultationFee: 2500,
    image: "/api/placeholder/doctor1",
    bio: "Specialist in cardiovascular diseases with extensive experience in preventive cardiology and cardiac interventions.",
    availability: [
      {
        day: "Monday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
      },
      {
        day: "Tuesday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00"]
      },
      {
        day: "Wednesday",
        slots: ["10:00", "11:00", "14:00", "15:00", "16:00"]
      },
      {
        day: "Thursday",
        slots: ["09:00", "10:00", "14:00", "15:00", "16:00"]
      },
      {
        day: "Friday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00"]
      }
    ]
  },
  {
    id: "2",
    name: "Dr. Michael Rodriguez",
    specialization: "Neurologist",
    experience: "12 years",
    rating: 4.8,
    consultationFee: 3000,
    image: "/api/placeholder/doctor2",
    bio: "Expert in neurological disorders with focus on epilepsy, migraines, and neurodegenerative diseases.",
    availability: [
      {
        day: "Monday",
        slots: ["10:00", "11:00", "15:00", "16:00", "17:00"]
      },
      {
        day: "Tuesday",
        slots: ["09:00", "10:00", "11:00", "15:00", "16:00"]
      },
      {
        day: "Wednesday",
        slots: ["09:00", "10:00", "15:00", "16:00"]
      },
      {
        day: "Thursday",
        slots: ["10:00", "11:00", "15:00", "16:00", "17:00"]
      },
      {
        day: "Saturday",
        slots: ["09:00", "10:00", "11:00", "12:00"]
      }
    ]
  },
  {
    id: "3",
    name: "Dr. Emily Watson",
    specialization: "Dermatologist",
    experience: "8 years",
    rating: 4.7,
    consultationFee: 2000,
    image: "/api/placeholder/doctor3",
    bio: "Specialized in medical and cosmetic dermatology with expertise in skin cancer detection and treatment.",
    availability: [
      {
        day: "Monday",
        slots: ["09:00", "10:00", "14:00", "15:00"]
      },
      {
        day: "Tuesday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
      },
      {
        day: "Wednesday",
        slots: ["10:00", "11:00", "14:00", "15:00"]
      },
      {
        day: "Friday",
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00"]
      },
      {
        day: "Saturday",
        slots: ["09:00", "10:00", "11:00"]
      }
    ]
  },
  {
    id: "4",
    name: "Dr. James Kumar",
    specialization: "Orthopedic Surgeon",
    experience: "20 years",
    rating: 4.9,
    consultationFee: 3500,
    image: "/api/placeholder/doctor4",
    bio: "Leading orthopedic surgeon specializing in joint replacement and sports medicine injuries.",
    availability: [
      {
        day: "Monday",
        slots: ["08:00", "09:00", "14:00", "15:00"]
      },
      {
        day: "Tuesday",
        slots: ["08:00", "09:00", "10:00", "14:00", "15:00"]
      },
      {
        day: "Wednesday",
        slots: ["08:00", "09:00", "14:00"]
      },
      {
        day: "Thursday",
        slots: ["08:00", "09:00", "10:00", "14:00", "15:00"]
      },
      {
        day: "Friday",
        slots: ["08:00", "09:00", "10:00"]
      }
    ]
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    specialization: "Pediatrician",
    experience: "10 years",
    rating: 4.8,
    consultationFee: 2200,
    image: "/api/placeholder/doctor5",
    bio: "Experienced pediatrician focused on child development, vaccinations, and adolescent health.",
    availability: [
      {
        day: "Monday",
        slots: ["09:00", "10:00", "11:00", "16:00", "17:00"]
      },
      {
        day: "Tuesday",
        slots: ["09:00", "10:00", "16:00", "17:00"]
      },
      {
        day: "Wednesday",
        slots: ["09:00", "10:00", "11:00", "16:00"]
      },
      {
        day: "Thursday",
        slots: ["09:00", "10:00", "16:00", "17:00"]
      },
      {
        day: "Friday",
        slots: ["09:00", "10:00", "11:00", "16:00", "17:00"]
      },
      {
        day: "Saturday",
        slots: ["09:00", "10:00", "11:00"]
      }
    ]
  },
  {
    id: "6",
    name: "Dr. Robert Kim",
    specialization: "Psychiatrist",
    experience: "14 years",
    rating: 4.6,
    consultationFee: 2800,
    image: "/api/placeholder/doctor6",
    bio: "Mental health specialist with expertise in anxiety, depression, and cognitive behavioral therapy.",
    availability: [
      {
        day: "Monday",
        slots: ["10:00", "11:00", "15:00", "16:00"]
      },
      {
        day: "Tuesday",
        slots: ["09:00", "10:00", "15:00", "16:00", "17:00"]
      },
      {
        day: "Wednesday",
        slots: ["10:00", "11:00", "15:00", "16:00"]
      },
      {
        day: "Thursday",
        slots: ["09:00", "10:00", "15:00", "16:00"]
      },
      {
        day: "Friday",
        slots: ["10:00", "11:00", "15:00"]
      }
    ]
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctor = mockDoctors.find(d => d.id === params.id)
    
    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ doctor })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch doctor" },
      { status: 500 }
    )
  }
}
