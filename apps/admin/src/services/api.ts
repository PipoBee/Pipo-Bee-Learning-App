import axios from 'axios';
import { authRedirectTo, supabase } from '../utils/supabase';

const API_BASE = '/api/v1';
const TOKEN_KEY = 'phonicsquest_token';
const LEGACY_TOKEN_KEY = 'phonicsquest_admin_token';
const USER_KEY = 'phonicsquest_user';

export const api = axios.create({
  baseURL: API_BASE,
});

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type UserRole = 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';

export type AppUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
};

export type ChildProfile = {
  id: string;
  displayName: string;
  avatarId: string;
  age: number;
  totalStars: number;
  totalCoins: number;
  streakDays: number;
};

export type AuthPayload = {
  user: AppUser;
  accessToken: string;
  studentProfile?: ChildProfile;
  children?: ChildProfile[];
};

function persistSession(data: AuthPayload) {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(LEGACY_TOKEN_KEY, data.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

async function loadUserProfile(userId: string, accessToken: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, role, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Could not load your profile');
  }

  return persistSession({
    user: {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      createdAt: data.created_at,
    },
    accessToken,
  });
}

function friendlyAuthError(error: { message?: string } | null, fallback: string) {
  const message = (error?.message || '').toLowerCase();
  if (message.includes('invalid login') || message.includes('invalid credentials')) {
    return 'Email or password is incorrect';
  }
  if (message.includes('already registered') || message.includes('user already')) {
    return 'This email is already registered. Sign in instead.';
  }
  if (message.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.';
  }
  return error?.message || fallback;
}

export const AuthAPI = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error || !data.session || !data.user) {
      throw new Error(friendlyAuthError(error, 'Email or password is incorrect'));
    }
    return loadUserProfile(data.user.id, data.session.access_token);
  },

  register: async (payload: {
    fullName: string;
    email: string;
    password: string;
    role: 'STUDENT' | 'PARENT' | 'student' | 'parent';
    phone?: string;
    country?: string;
    city?: string;
  }) => {
    const role = String(payload.role).toLowerCase() === 'parent' ? 'parent' : 'student';
    const { data, error } = await supabase.auth.signUp({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      options: {
        emailRedirectTo: authRedirectTo('/auth/callback'),
        data: {
          full_name: payload.fullName.trim(),
          role,
          phone: payload.phone || null,
          country: payload.country || null,
          city: payload.city || null,
        },
      },
    });
    if (error) throw new Error(friendlyAuthError(error, 'Could not create account'));
    if (!data.session || !data.user) {
      return {
        needsEmailConfirmation: true as const,
        email: payload.email.trim().toLowerCase(),
      };
    }
    return {
      needsEmailConfirmation: false as const,
      ...(await loadUserProfile(data.user.id, data.session.access_token)),
    };
  },

  signInWithGoogle: async () => {
    // redirectTo must use the current origin so localhost and 127.0.0.1 never mix
    // (mixed hosts break PKCE because the code_verifier lives in that origin's storage).
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authRedirectTo('/auth/callback'),
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
        skipBrowserRedirect: false,
      },
    });
    if (error) throw new Error(error.message || 'Could not start Google sign-in');
    if (!data?.url) {
      throw new Error('Google sign-in did not start. Check Google is enabled in Supabase Auth.');
    }
  },

  requestPasswordReset: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: authRedirectTo('/reset-password'),
    });
    if (error) throw new Error(error.message || 'Could not send reset email');
  },

  updatePassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message || 'Could not update password');
  },

  resendConfirmation: async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: authRedirectTo('/auth/callback'),
      },
    });
    if (error) throw new Error(error.message || 'Could not resend confirmation email');
  },

  me: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  getStoredUser: (): AppUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw || !getToken()) {
      return null;
    }
    try {
      return JSON.parse(raw) as AppUser;
    } catch {
      return null;
    }
  },

  restoreSession: async (): Promise<AppUser | null> => {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) {
      return null;
    }
    const payload = await loadUserProfile(data.session.user.id, data.session.access_token);
    return payload.user;
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const StudentAPI = {
  getDashboard: async () => {
    const res = await api.get('/students/dashboard');
    return res.data;
  },

  getFirstLevel: async () => {
    const res = await api.get('/students/levels/first');
    return res.data;
  },

  completeLevel: async (
    levelId: string,
    payload: { score: number; correctCount: number; totalCount: number },
  ) => {
    const res = await api.post(`/students/levels/${levelId}/complete`, payload);
    return res.data;
  },
};

export const ParentAPI = {
  listChildren: async () => {
    const res = await api.get('/parents/children');
    return res.data as {
      maxChildren: number;
      remainingSlots: number;
      children: ChildProfile[];
    };
  },

  createChild: async (payload: { displayName: string; age: number; avatarId: string }) => {
    const res = await api.post('/parents/children', payload);
    return res.data as ChildProfile;
  },

  getChildDashboard: async (id: string) => {
    const res = await api.get(`/parents/children/${id}/dashboard`);
    return res.data;
  },

  deleteChild: async (id: string) => {
    const res = await api.delete(`/parents/children/${id}`);
    return res.data;
  },
};

export const AdminAPI = {
  login: AuthAPI.login,
  logout: AuthAPI.logout,

  getLearnerAnalytics: async (studentId?: string) => {
    const res = await api.get('/admin/analytics/learner', {
      params: studentId ? { studentId } : undefined,
    });
    return res.data;
  },

  listUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  listStudents: async () => {
    const res = await api.get('/admin/students');
    return res.data;
  },

  getStudentDashboard: async (id: string) => {
    const res = await api.get(`/admin/students/${id}/dashboard`);
    return res.data;
  },

  getCurriculumBundle: async () => {
    const res = await api.get('/content/bundle');
    return res.data;
  },

  getAudioList: async () => {
    const res = await api.get('/admin/audio');
    return res.data;
  },

  uploadAudio: async (formData: FormData) => {
    const res = await api.post('/admin/audio/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteAudio: async (id: string) => {
    const res = await api.delete(`/admin/audio/${id}`);
    return res.data;
  },
};
