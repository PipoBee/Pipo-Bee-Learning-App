import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { findCountry } from '../data/countries';
import { supabase } from '../utils/supabase';

export type ProfileRole = 'student' | 'parent';

export type UserProfile = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role: ProfileRole;
  phone: string | null;
  country: string | null;
  city: string | null;
  ageGroup: string | null;
  learningGoals: string[];
  startChoice: string | null;
  nativeLanguage: string | null;
  timezone: string | null;
  dailyGoalMinutes: number | null;
  parentEmail: string | null;
  parentConsentStatus: string | null;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
};

export type SignupInput = {
  fullName: string;
  email: string;
  password: string;
  country: string;
  city: string;
  phoneNational: string;
  role: ProfileRole;
  acceptedTerms: boolean;
};

function mapProfile(row: any): UserProfile {
  return {
    id: row.id,
    fullName: row.full_name || '',
    avatarUrl: row.avatar_url ?? null,
    role: row.role === 'parent' ? 'parent' : 'student',
    phone: row.phone ?? null,
    country: row.country ?? null,
    city: row.city ?? null,
    ageGroup: row.age_group ?? null,
    learningGoals: row.learning_goals || [],
    startChoice: row.start_choice ?? null,
    nativeLanguage: row.native_language ?? null,
    timezone: row.timezone ?? null,
    dailyGoalMinutes: row.daily_goal_minutes ?? null,
    parentEmail: row.parent_email ?? null,
    parentConsentStatus: row.parent_consent_status ?? null,
    profileCompleted: Boolean(row.profile_completed),
    onboardingCompleted: Boolean(row.onboarding_completed),
  };
}

export function validateFullName(value: string): string | null {
  const name = value.trim();
  if (name.length < 2) return 'Enter your full name (at least 2 characters).';
  if (name.length > 60) return 'Name must be 60 characters or fewer.';
  return null;
}

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
  return null;
}

export function validateCity(value: string): string | null {
  const city = value.trim();
  if (city.length < 2) return 'Enter your city (at least 2 characters).';
  if (city.length > 60) return 'City must be 60 characters or fewer.';
  return null;
}

export function validateCountry(code: string): string | null {
  if (!code || !findCountry(code)) return 'Choose a country.';
  return null;
}

const E164_RE = /^\+[1-9][0-9]{7,14}$/;

export function toE164(phoneNational: string, countryCode: string): string | null {
  const raw = phoneNational.trim();
  if (!raw || !countryCode) return null;

  // Prefer libphonenumber; also accept a value that is already E.164.
  const parsed =
    parsePhoneNumberFromString(raw, countryCode as any) ||
    (raw.startsWith('+') ? parsePhoneNumberFromString(raw) : undefined);

  if (!parsed || !parsed.isValid()) return null;
  const e164 = parsed.format('E.164');
  return E164_RE.test(e164) ? e164 : null;
}

export function validatePhone(phoneNational: string, countryCode: string): string | null {
  if (!phoneNational.trim()) return 'Phone number is required.';
  if (!toE164(phoneNational, countryCode)) {
    return 'Enter a valid phone number for the selected country.';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

export function passwordStrength(password: string): 'weak' | 'okay' | 'strong' {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score >= 4) return 'strong';
  if (score >= 2) return 'okay';
  return 'weak';
}

export function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export const ProfileAPI = {
  getMine: async (): Promise<UserProfile | null> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return null;

    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return mapProfile(data);
  },

  ensureMine: async (): Promise<UserProfile> => {
    const existing = await ProfileAPI.getMine();
    if (existing) return existing;

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) throw new Error('Please sign in again.');

    const meta = user.user_metadata || {};
    const fullName =
      (meta.full_name as string) ||
      (meta.name as string) ||
      user.email?.split('@')[0] ||
      'Learner';
    const role: ProfileRole = String(meta.role || 'student').toLowerCase() === 'parent' ? 'parent' : 'student';

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          full_name: fullName.slice(0, 60),
          avatar_url: (meta.avatar_url as string) || (meta.picture as string) || null,
          role,
          phone: (meta.phone as string) || null,
          country: (meta.country as string) || null,
          city: (meta.city as string) || null,
          timezone: browserTimezone(),
          profile_completed: Boolean(meta.phone && meta.country && meta.city),
        },
        { onConflict: 'id' },
      )
      .select('*')
      .single();

    if (error || !data) throw new Error(error?.message || 'Could not create your profile');
    return mapProfile(data);
  },

  completeProfile: async (input: {
    fullName: string;
    country: string;
    city: string;
    phoneNational: string;
    role: ProfileRole;
  }): Promise<UserProfile> => {
    const nameError = validateFullName(input.fullName);
    if (nameError) throw new Error(nameError);
    const countryError = validateCountry(input.country);
    if (countryError) throw new Error(countryError);
    const cityError = validateCity(input.city);
    if (cityError) throw new Error(cityError);
    const phoneError = validatePhone(input.phoneNational, input.country);
    if (phoneError) throw new Error(phoneError);

    const phone = toE164(input.phoneNational, input.country)!;
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) throw new Error('Please sign in again.');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: input.fullName.trim(),
        country: input.country,
        city: input.city.trim(),
        phone,
        role: input.role,
        timezone: browserTimezone(),
        profile_completed: true,
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (error || !data) throw new Error(error?.message || 'Could not save your profile');

    // Keep public.users in sync for curriculum / dashboards
    await supabase
      .from('users')
      .update({
        full_name: input.fullName.trim(),
        role: input.role === 'parent' ? 'PARENT' : 'STUDENT',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return mapProfile(data);
  },

  saveOnboarding: async (input: {
    ageGroup: string;
    learningGoals: string[];
    startChoice: string | null;
    parentEmail?: string;
    role: ProfileRole;
  }): Promise<UserProfile> => {
    if (!input.ageGroup) throw new Error('Choose an age group to continue.');

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) throw new Error('Please sign in again.');

    const under13 = ['4-6', '7-9', '10-13'].includes(input.ageGroup);
    // TODO: legal consent handling needs review for under-13 students.
    const parentConsentStatus =
      under13 && input.role === 'student' ? 'pending' : null;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        age_group: input.ageGroup,
        learning_goals: input.learningGoals,
        start_choice: input.startChoice,
        parent_email: input.parentEmail?.trim() || null,
        parent_consent_status: parentConsentStatus,
        timezone: browserTimezone(),
        onboarding_completed: true,
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (error || !data) throw new Error(error?.message || 'Could not save onboarding');
    return mapProfile(data);
  },

  nextRoute: (profile: UserProfile | null, appRole?: string): string => {
    if (appRole === 'ADMIN' || appRole === 'TEACHER') return '/dashboard';
    if (!profile || !profile.profileCompleted) return '/complete-profile';
    if (!profile.onboardingCompleted) return '/onboarding';
    return '/dashboard';
  },

  updatePersonalDetails: async (input: {
    fullName: string;
    country: string;
    city: string;
    phoneNational: string;
    role: ProfileRole;
    ageGroup: string | null;
    nativeLanguage: string | null;
    dailyGoalMinutes: number | null;
    parentEmail: string | null;
    learningGoals: string[];
  }): Promise<UserProfile> => {
    const nameError = validateFullName(input.fullName);
    if (nameError) throw new Error(nameError);
    const countryError = validateCountry(input.country);
    if (countryError) throw new Error(countryError);
    const cityError = validateCity(input.city);
    if (cityError) throw new Error(cityError);
    const phoneError = validatePhone(input.phoneNational, input.country);
    if (phoneError) throw new Error(phoneError);
    if (input.parentEmail?.trim()) {
      const parentEmailError = validateEmail(input.parentEmail);
      if (parentEmailError) throw new Error(parentEmailError);
    }

    const phone = toE164(input.phoneNational, input.country)!;
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) throw new Error('Please sign in again.');

    const under13 = ['4-6', '7-9', '10-13'].includes(input.ageGroup || '');
    const parentConsentStatus =
      under13 && input.role === 'student' ? 'pending' : null;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: input.fullName.trim(),
        country: input.country,
        city: input.city.trim(),
        phone,
        role: input.role,
        age_group: input.ageGroup,
        native_language: input.nativeLanguage?.trim() || null,
        daily_goal_minutes: input.dailyGoalMinutes,
        parent_email: input.parentEmail?.trim() || null,
        parent_consent_status: parentConsentStatus,
        learning_goals: input.learningGoals,
        timezone: browserTimezone(),
        profile_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (error || !data) throw new Error(error?.message || 'Could not update your profile');

    await supabase
      .from('users')
      .update({
        full_name: input.fullName.trim(),
        role: input.role === 'parent' ? 'PARENT' : 'STUDENT',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return mapProfile(data);
  },
};
