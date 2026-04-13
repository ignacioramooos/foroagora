

## Plan: Unify Registration + Onboarding into One Seamless Flow

### Problem
Currently, registration and onboarding are two separate pages/flows. After signup, the app forces users to `/onboarding` and blocks all other routes. The user wants:
1. Landing page is always the landing page — no redirects
2. Registration = signup + profile questions in one unified flow on `/auth`
3. Flow: email/password → profile steps → "check your email" confirmation
4. The separate `/onboarding` route and forced redirect logic are removed

### Changes

**1. Merge OnboardingFlow into AuthPage (`src/pages/AuthPage.tsx`)**
- After the user submits signup (email + password + name), instead of immediately showing "check your email", transition to the 3 onboarding steps (identity, education, commitment) inline on the same page
- Use a state machine: `login` → `signup` → `onboarding-step-1` → `onboarding-step-2` → `onboarding-step-3` → `email-confirmation`
- The profile data (full_name, age_range, department, institution, how_found_us, interests, accepted_terms) is saved to the `profiles` table after step 3 completes
- Then show the "Revisá tu email" screen
- Import the departments, age ranges, interests, and howFound options from the current OnboardingFlow

**2. Update routing in `App.tsx`**
- Remove the `isLoggedIn && !user.onboardingCompleted` block that forces redirect to `/onboarding`
- Remove the `/onboarding` route entirely
- When logged in but onboarding not completed, still allow normal navigation (the profile questions were already answered during signup, so `onboarding_completed` will be true)
- The catch-all `*` for logged-in users should go to `/` (landing) not `/dashboard`

**3. Handle Google OAuth onboarding**
- For Google sign-in users who haven't completed onboarding: when they land on the app after OAuth redirect and `onboardingCompleted` is false, show a modal or redirect to `/auth?complete-profile=true` to collect the missing profile data
- This is the only case where we still need a post-login onboarding prompt

**4. Delete `src/pages/OnboardingFlow.tsx`**
- No longer needed as a separate file

**5. Update `AuthContext.tsx`**
- Keep `onboardingCompleted` tracking for Google OAuth edge case
- Remove any logic that depends on the `/onboarding` route

### Technical Details
- The signup function creates the auth user and triggers the `handle_new_user` DB function which creates a basic profile
- The onboarding steps update that profile with additional fields before showing email confirmation
- The `onboarding_completed` flag is set to `true` after step 3 saves successfully
- For login mode, behavior stays the same (no onboarding steps shown)

