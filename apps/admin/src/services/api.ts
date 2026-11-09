import axios from 'axios';
import { supabase } from '../utils/supabase';

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

export const AuthAPI = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error || !data.session || !data.user) {
      throw new Error(error?.message || 'Invalid email or password');
    }
    return loadUserProfile(data.user.id, data.session.access_token);
  },

  register: async (payload: {
    fullName: string;
    email: string;
    password: string;
    role: 'STUDENT' | 'PARENT';
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName.trim(),
          role: payload.role,
        },
      },
    });
    if (error) throw new Error(error.message);
    if (!data.session || !data.user) {
      throw new Error('Account created. Check your email to confirm, then sign in.');
    }
    return loadUserProfile(data.user.id, data.session.access_token);
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

  logout: () => {
    void supabase.auth.signOut();
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
