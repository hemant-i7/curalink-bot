import { NextRequest, NextResponse } from "next/server";
import Patient from "@/lib/models/Patient";
import { Task } from "@/lib/models/Task";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Initialize leaderboard data for existing patients
    // First, add some demo patients with leaderboard data
    const demoPatients = [
      {
        userId: "sarah.chen@example.com",
        role: "patient",
        hasCompletedInfo: true,
        personalInfo: {
          name: "Sarah Chen",
          email: "sarah.chen@example.com",
          age: 28,
          gender: "female",
        },
        medicalHistory: {
          conditions: [],
          medications: [],
          allergies: [],
          surgeries: [],
          familyHistory: [],
        },
        coins: 1180,
        level: 7,
        streak: 8,
        completedTasks: 142,
        avatar: "Stethoscope",
        totalEarned: 2500,
        bestStreak: 15,
        rankThisWeek: 2,
      },
      {
        userId: "dr.mike@example.com",
        role: "patient",
        hasCompletedInfo: true,
        personalInfo: {
          name: "Dr. Mike",
          email: "dr.mike@example.com",
          age: 34,
          gender: "male",
        },
        medicalHistory: {
          conditions: [],
          medications: [],
          allergies: [],
          surgeries: [],
          familyHistory: [],
        },
        coins: 1050,
        level: 6,
        streak: 15,
        completedTasks: 128,
        avatar: "UserCheck",
        totalEarned: 2200,
        bestStreak: 28,
        rankThisWeek: 3,
      },
      {
        userId: "alex.runner@example.com",
        role: "patient",
        hasCompletedInfo: true,
        personalInfo: {
          name: "Alex Runner",
          email: "alex.runner@example.com",
          age: 25,
          gender: "other",
        },
        medicalHistory: {
          conditions: [],
          medications: [],
          allergies: [],
          surgeries: [],
          familyHistory: [],
        },
        coins: 980,
        level: 6,
        streak: 6,
        completedTasks: 119,
        avatar: "Zap",
        totalEarned: 1980,
        bestStreak: 12,
        rankThisWeek: 4,
      },
    ];

    // Check if demo patients exist, if not create them
    let createdPatientsCount = 0;
    for (const demoPatient of demoPatients) {
      const existingPatient = await Patient.findOne({
        userId: demoPatient.userId,
      });
      if (!existingPatient) {
        await Patient.create(demoPatient);
        createdPatientsCount++;
      }
    }

    // Update existing patients to have default leaderboard fields
    const existingPatients = await Patient.find({
      role: "patient",
      $or: [{ coins: { $exists: false } }, { coins: null }],
    });

    let updatedPatientsCount = 0;
    for (const patient of existingPatients) {
      await Patient.findByIdAndUpdate(patient._id, {
        $set: {
          coins: 0,
          level: 1,
          streak: 0,
          completedTasks: 0,
          avatar: "Users",
          totalEarned: 0,
          bestStreak: 0,
          rankThisWeek: 0,
        },
      });
      updatedPatientsCount++;
    }

    // Initialize default tasks
    const defaultTasks = [
      {
        title: "Complete 7 Push-ups",
        description: "Build upper body strength with 7 push-ups",
        category: "fitness",
        coins: 50,
        difficulty: "easy",
        icon: "Activity",
      },
      {
        title: "Drink 8 Glasses of Water",
        description: "Stay hydrated throughout the day",
        category: "wellness",
        coins: 30,
        difficulty: "easy",
        icon: "Heart",
      },
      {
        title: "10-Minute Meditation",
        description: "Practice mindfulness and reduce stress",
        category: "wellness",
        coins: 40,
        difficulty: "medium",
        icon: "Star",
      },
      {
        title: "Take Daily Vitamins",
        description: "Don't forget your daily supplements",
        category: "medical",
        coins: 25,
        difficulty: "easy",
        icon: "Plus",
      },
      {
        title: "30-Minute Walk",
        description: "Get your daily cardio exercise",
        category: "fitness",
        coins: 60,
        difficulty: "medium",
        icon: "TrendingUp",
      },
      {
        title: "Eat 5 Servings of Fruits/Vegetables",
        description: "Maintain a balanced, nutritious diet",
        category: "nutrition",
        coins: 45,
        difficulty: "medium",
        icon: "Heart",
      },
    ];

    const existingTasks = await Task.countDocuments();
    let createdTasksCount = 0;

    if (existingTasks === 0) {
      await Task.insertMany(defaultTasks);
      createdTasksCount = defaultTasks.length;
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      demoPatientsCreated: createdPatientsCount,
      existingPatientsUpdated: updatedPatientsCount,
      tasksCreated: createdTasksCount,
      existingTasks: existingTasks > 0 ? existingTasks : createdTasksCount,
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
