import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";

type Role = "staff" | "parent" | "member";

type UserData = {
  uid: string;
  name: string;
  role: Role;
  branches?: string[];
  [key: string]: any;
};

type AuthContextType = {
  user: FirebaseUser | null | boolean; // false = member, null = not logged in
  userData: UserData | null;
  loading: boolean;
  loginMember: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isMember: boolean;
  isFirebaseUser: boolean;
  role: Role | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  loginMember: async () => {},
  logout: async () => {},
  refreshUserData: async () => {},
  isMember: false,
  isFirebaseUser: false,
  role: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null | boolean>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserData(snap.data() as UserData);
        } else {
          console.warn("User profile not found in Firestore");
        }
        setLoading(false);
      } else {
        const saved = await AsyncStorage.getItem("memberUserData");
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(false);
          setUserData(parsed);
        } else {
          setUser(null);
          setUserData(null);
        }
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  const loginMember = async (data: any) => {
    const enrichedData = {
      ...data,
      role: data.role ?? "member",
      onboardingComplete: data.onboardingComplete ?? true,
    };

    await AsyncStorage.setItem("memberUserData", JSON.stringify(enrichedData));
    setUser(false);
    setUserData(enrichedData);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log("Sign out skipped (likely member login)");
    }

    await AsyncStorage.removeItem("memberUserData");
    setUser(null);
    setUserData(null);

    setTimeout(() => {
      router.replace("/login");
    }, 100);
  };

  const refreshUserData = async () => {
    if (user && typeof user !== "boolean") {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData(snap.data() as UserData);
      }
    }

    if (user === false && userData?.uid) {
      try {
        const ref = doc(db, "members", userData.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserData(snap.data() as UserData);
        }
      } catch (e) {
        console.warn("Failed to refresh member data", e);
      }
    }
  };

  const isMember = user === false;
  const isFirebaseUser = !!user && typeof user !== "boolean";

  // ✨ Computed role (for use across the app)
  const role: Role | null =
    user === false ? "member" : (userData?.role as Role | undefined) ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        loginMember,
        logout,
        refreshUserData,
        isMember,
        isFirebaseUser,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
