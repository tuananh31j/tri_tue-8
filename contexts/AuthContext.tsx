import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { UserProfile, UserRole } from "../types";
import { isAdmin } from "../config/admins";

const DATABASE_URL_BASE =
  "https://morata-a9eba-default-rtdb.asia-southeast1.firebasedatabase.app/datasheet";
const USERS_URL = `${DATABASE_URL_BASE}/Users.json`;
const TEACHERS_URL = `${DATABASE_URL_BASE}/Gi%C3%A1o_vi%C3%AAn.json`;

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  needsOnboarding: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithTeacherCredentials: (
    email: string,
    password: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: (fullName: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch or create user profile
  const fetchUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      const response = await fetch(USERS_URL);
      const data = await response.json();

      // Find existing user profile
      let profile: UserProfile | null = null;
      if (data) {
        const existingProfile = Object.entries(data).find(
          ([_, profile]: [string, any]) => profile.email === user.email
        );

        if (existingProfile) {
          const [id, profileData] = existingProfile;
          profile = { ...(profileData as UserProfile), uid: id };
        }
      }

      // Create new user profile if not exists
      if (!profile) {
        const role: UserRole = isAdmin(user.email) ? "admin" : "teacher";
        const newProfile: Omit<UserProfile, "uid"> = {
          email: user.email!,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log("📝 Creating new user profile:", {
          email: user.email,
          role,
        });

        const createResponse = await fetch(USERS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProfile),
        });

        if (createResponse.ok) {
          const result = await createResponse.json();
          profile = { ...newProfile, uid: result.name };
        } else {
          return null;
        }
      }

      // Fetch teacher position from Giáo_viên table
      try {
        const teachersResponse = await fetch(TEACHERS_URL);
        const teachersData = await teachersResponse.json();

        if (teachersData) {
          const teacherEntry = Object.entries(teachersData).find(
            ([_, teacher]: [string, any]) =>
              teacher.Email === user.email ||
              teacher["Email công ty"] === user.email
          );

          if (teacherEntry) {
            const [teacherId, teacherData]: [string, any] = teacherEntry;
            const position = teacherData["Vị trí"] || "";

            // Check admin status: either by position OR by email in admin list
            const isAdminByPosition = position === "Admin";
            const isAdminByEmail = isAdmin(user.email); // Using the function from config/admins.ts
            const finalIsAdmin = isAdminByPosition || isAdminByEmail;

            // Update profile with position info
            profile = {
              ...profile,
              teacherId,
              position,
              isAdmin: finalIsAdmin,
            };

            console.log("✅ User profile loaded with position:", {
              email: user.email,
              position: position,
              isAdminByPosition: isAdminByPosition,
              isAdminByEmail: isAdminByEmail,
              finalIsAdmin: finalIsAdmin,
              teacherId: teacherId,
              fullTeacherData: teacherData,
            });
          } else {
            // If no teacher entry found, fallback to email-based admin check
            const isAdminByEmail = isAdmin(user.email);
            profile = {
              ...profile,
              isAdmin: isAdminByEmail,
            };
            console.log(
              "⚠️ No teacher entry found, using email-based admin check:",
              { email: user.email, isAdmin: isAdminByEmail }
            );
          }
        }
      } catch (error) {
        console.warn("⚠️ Could not fetch teacher position:", error);
      }

      return profile;
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isSubscribed) return;

      setCurrentUser(user);

      if (user) {
        console.log("👤 User logged in:", user.email);
        try {
          const profile = await fetchUserProfile(user);
          if (!isSubscribed) return;

          setUserProfile(profile);

          // Check if teacher needs onboarding
          if (profile && profile.role === "teacher" && !profile.teacherId) {
            console.log("🎓 Teacher needs onboarding");
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }
        } catch (error) {
          console.error("❌ Error loading user profile:", error);
          setUserProfile(null);
          setNeedsOnboarding(false);
        }
      } else {
        console.log("👤 User logged out");
        setUserProfile(null);
        setNeedsOnboarding(false);
      }

      if (isSubscribed) {
        setLoading(false);
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      console.log("📝 Creating account with email:", email);

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);

      console.log("✅ Account created. Verification email sent to:", email);
    } catch (error) {
      console.error("❌ Error creating account:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log("� Signing in with email:", email);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        console.warn("⚠️ Email not verified");
        // You can choose to allow or block unverified users
        // For now, we'll allow but show a warning
      }

      console.log("✅ Sign in successful");
    } catch (error) {
      console.error("❌ Error signing in:", error);
      throw error;
    }
  };

  const signInWithTeacherCredentials = async (
    email: string,
    password: string
  ) => {
    try {
      console.log("🏫 Signing in with teacher credentials:", email);

      // Fetch teachers from Firebase
      const response = await fetch(TEACHERS_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch teachers data");
      }

      const teachersData = await response.json();
      if (!teachersData) {
        throw new Error("No teachers found");
      }

      // Find teacher by email and password
      const teacherEntry = Object.entries(teachersData).find(
        ([id, teacher]: [string, any]) => {
          const teacherEmail =
            teacher?.["Email"] || teacher?.["Email công ty"] || "";
          const teacherPassword = teacher?.["Password"] || "";
          return (
            teacherEmail.toLowerCase() === email.toLowerCase() &&
            teacherPassword === password
          );
        }
      );

      if (!teacherEntry) {
        throw new Error("Invalid email or password");
      }

      const [teacherId, teacherData] = teacherEntry as [string, any];

      // Create a mock user object for teacher login
      const mockUser = {
        uid: `teacher_${teacherId}`,
        email: teacherData["Email"] || teacherData["Email công ty"],
        emailVerified: true,
        displayName: teacherData["Họ và tên"],
      } as User;

      // Create user profile
      const profile: UserProfile = {
        uid: mockUser.uid,
        email: mockUser.email!,
        displayName: teacherData["Họ và tên"],
        role: teacherData["Vị trí"] === "Admin" ? "admin" : "teacher",
        isAdmin: teacherData["Vị trí"] === "Admin" || isAdmin(mockUser.email!),
        createdAt: new Date().toISOString(),
      };

      // Set the current user and profile directly (bypassing Firebase Auth)
      setCurrentUser(mockUser);
      setUserProfile(profile);
      setNeedsOnboarding(false);

      console.log("✅ Teacher sign in successful:", profile);
    } catch (error) {
      console.error("❌ Error signing in with teacher credentials:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear local state first (for teacher authentication)
      setCurrentUser(null);
      setUserProfile(null);
      setNeedsOnboarding(false);

      // Try Firebase signOut (for legacy users)
      try {
        await firebaseSignOut(auth);
      } catch (firebaseError) {
        // Ignore Firebase errors for teacher authentication
        console.log("💡 Firebase signOut skipped (teacher authentication)");
      }

      console.log("👋 Logged out");
    } catch (error) {
      console.error("❌ Logout error:", error);
      throw error;
    }
  };

  const completeOnboarding = async (fullName: string) => {
    if (!currentUser || !userProfile) {
      throw new Error("No user logged in");
    }

    try {
      console.log("🎓 Starting teacher onboarding:", {
        fullName,
        email: currentUser.email,
      });

      // 1. Create teacher record in Giáo_viên
      const teacherData = {
        "Họ và tên": fullName,
        Email: currentUser.email,
        "Biên chế": "Mới",
        "Ngày tạo": new Date().toISOString(),
      };

      const teacherResponse = await fetch(TEACHERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherData),
      });

      if (!teacherResponse.ok) {
        throw new Error("Failed to create teacher record");
      }

      const teacherResult = await teacherResponse.json();
      const teacherId = teacherResult.name;
      console.log("✅ Teacher record created:", teacherId);

      // 2. Update user profile with teacherId
      const userUpdateUrl = `${DATABASE_URL_BASE}/Users/${userProfile.uid}.json`;
      const updateResponse = await fetch(userUpdateUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update user profile");
      }

      console.log("✅ User profile updated with teacherId");

      // 3. Update local state
      setUserProfile({
        ...userProfile,
        teacherId,
        updatedAt: new Date().toISOString(),
      });
      setNeedsOnboarding(false);

      console.log("🎉 Onboarding completed successfully");
    } catch (error) {
      console.error("❌ Onboarding error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    needsOnboarding,
    signUpWithEmail,
    signInWithEmail,
    signInWithTeacherCredentials,
    signOut,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
