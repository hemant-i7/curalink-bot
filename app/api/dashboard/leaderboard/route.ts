import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get top 10 users sorted by total coins
    const topUsers = await User.find({})
      .select(
        "name email coins level streak completedTasks avatar totalEarned bestStreak"
      )
      .sort({ coins: -1, totalEarned: -1 })
      .limit(10)
      .lean();

    // Calculate weekly rankings
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // For now, we'll use a simple ranking based on current coins
    // In a more complex system, you could track weekly coin earnings
    const leaderboard = topUsers.map((user, index) => ({
      id: user._id.toString(),
      name: user.name,
      coins: user.coins,
      level: user.level,
      streak: user.streak,
      completedTasks: user.completedTasks,
      avatar: user.avatar || "Users",
      totalEarned: user.totalEarned,
      bestStreak: user.bestStreak,
      rankThisWeek: index + 1,
    }));

    return NextResponse.json({
      success: true,
      leaderboard,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leaderboard",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Update user ranking (called periodically or after significant changes)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Update weekly rankings for all users
    const users = await User.find({})
      .sort({ coins: -1, totalEarned: -1 })
      .select("_id");

    const updatePromises = users.map((user, index) =>
      User.findByIdAndUpdate(user._id, { rankThisWeek: index + 1 })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Rankings updated successfully",
      updatedUsers: users.length,
    });
  } catch (error) {
    console.error("Error updating rankings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update rankings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
