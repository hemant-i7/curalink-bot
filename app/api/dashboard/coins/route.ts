import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "@/lib/models/User";
import { CoinTransaction } from "@/lib/models/CoinTransaction";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).select(
      "coins level streak completedTasks totalEarned bestStreak"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      userData: {
        coins: user.coins,
        level: user.level,
        streak: user.streak,
        completedTasks: user.completedTasks,
        totalEarned: user.totalEarned,
        bestStreak: user.bestStreak,
      },
    });
  } catch (error) {
    console.error("Error fetching user coins:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const {
      taskId,
      taskTitle,
      taskCategory,
      coinsEarned,
      difficulty,
      streakBonus = 0,
    } = await request.json();

    // Validate required fields
    if (!taskId || !taskTitle || !taskCategory || !coinsEarned || !difficulty) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if task was already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingTransaction = await CoinTransaction.findOne({
      userId: user._id,
      taskId: taskId,
      completedAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (existingTransaction) {
      return NextResponse.json(
        { success: false, error: "Task already completed today" },
        { status: 409 }
      );
    }

    // Calculate streak and bonus
    const lastCompletion = user.lastTaskCompletionDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    let newStreak = 1;
    let bonusCoins = streakBonus;

    if (lastCompletion) {
      const lastCompletionDate = new Date(lastCompletion);
      lastCompletionDate.setHours(0, 0, 0, 0);

      if (lastCompletionDate.getTime() === yesterday.getTime()) {
        // Consecutive day
        newStreak = user.streak + 1;

        // Apply streak bonus (every 7 days)
        if (newStreak % 7 === 0) {
          bonusCoins += Math.floor(coinsEarned * 0.5); // 50% bonus every 7 days
        }
      } else if (lastCompletionDate.getTime() < yesterday.getTime()) {
        // Streak broken
        newStreak = 1;
      } else {
        // Same day or future (shouldn't happen)
        newStreak = user.streak;
      }
    }

    const totalCoinsAwarded = coinsEarned + bonusCoins;

    // Create coin transaction record
    const transaction = new CoinTransaction({
      userId: user._id,
      taskId,
      taskTitle,
      taskCategory,
      coinsEarned,
      difficulty,
      streakAtCompletion: newStreak,
      bonusCoins,
      totalCoinsAwarded,
      completedAt: new Date(),
    });

    await transaction.save();

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $inc: {
          coins: totalCoinsAwarded,
          completedTasks: 1,
          totalEarned: totalCoinsAwarded,
        },
        $set: {
          streak: newStreak,
          lastTaskCompletionDate: new Date(),
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction._id,
        coinsEarned: totalCoinsAwarded,
        bonusCoins,
        newStreak,
        newLevel: updatedUser.level,
      },
      userData: {
        coins: updatedUser.coins,
        level: updatedUser.level,
        streak: updatedUser.streak,
        completedTasks: updatedUser.completedTasks,
        totalEarned: updatedUser.totalEarned,
      },
    });
  } catch (error) {
    console.error("Error processing coin transaction:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process coin transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
