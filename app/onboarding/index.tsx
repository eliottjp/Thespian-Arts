// app/onboarding/index.tsx
import { useEffect } from "react";
import { useRouter, useRootNavigationState } from "expo-router";

export default function OnboardingIndex() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const isReady = navigationState?.key != null;

  useEffect(() => {
    if (isReady) {
      router.replace("/onboarding/step1");
    }
  }, [isReady]);

  return null;
}
