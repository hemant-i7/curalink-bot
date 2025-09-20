import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models/User";
import { Task } from "@/lib/models/Task";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Initialize default users for leaderboard
    const defaultUsers = [
      {
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
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
        name: "Dr. Mike",
        email: "dr.mike@example.com",
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
        name: "Alex Runner",
        email: "alex.runner@example.com",
        coins: 980,
        level: 6,
        streak: 6,
        completedTasks: 119,
        avatar: "Zap",
        totalEarned: 1980,
        bestStreak: 12,
        rankThisWeek: 4,
      },
      {
        name: "Wellness Guru",
        email: "wellness.guru@example.com",
        coins: 875,
        level: 5,
        streak: 22,
        completedTasks: 105,
        avatar: "Heart",
        totalEarned: 1750,
        bestStreak: 25,
        rankThisWeek: 5,
      },
    ];

    // Check if users already exist
    const existingUsers = await User.countDocuments();
    let createdUsersCount = 0;

    if (existingUsers === 0) {
      await User.insertMany(defaultUsers);
      createdUsersCount = defaultUsers.length;
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
      usersCreated: createdUsersCount,
      tasksCreated: createdTasksCount,
      existingUsers: existingUsers > 0 ? existingUsers : createdUsersCount,
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
