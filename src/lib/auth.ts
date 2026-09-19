import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userStats, users, type User, type UserStats } from "@/db/schema";
import { ApiError } from "@/lib/apiError";

export type AppUser = User & {
  stats: UserStats | null;
};

async function fetchUserWithStats(clerkId: string): Promise<AppUser | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user) {
    return null;
  }

  const [stats] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, user.id))
    .limit(1);

  return { ...user, stats: stats ?? null };
}

async function createUser(clerkId: string): Promise<AppUser> {
  const clerkUser = await currentUser();
  const email =
    clerkUser?.emailAddresses[0]?.emailAddress ?? `${clerkId}@clerk.local`;
  const name = clerkUser?.fullName ?? clerkUser?.firstName ?? null;

  const [newUser] = await db
    .insert(users)
    .values({ clerkId, email, name })
    .returning();

  const [stats] = await db
    .insert(userStats)
    .values({ userId: newUser.id })
    .returning();

  return { ...newUser, stats };
}

export async function requireUser(): Promise<AppUser> {
  const { userId } = await auth();
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const existing = await fetchUserWithStats(userId);
  if (existing) {
    return existing;
  }

  try {
    return await createUser(userId);
  } catch (error) {
    const raced = await fetchUserWithStats(userId);
    if (raced) {
      return raced;
    }
    throw error;
  }
}

export async function requireProUser(): Promise<AppUser> {
  const user = await requireUser();
  if (!user.isPro) {
    throw new ApiError(403, "Pro subscription required", "pro_required");
  }
  return user;
}
