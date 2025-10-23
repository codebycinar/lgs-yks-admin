import api from '../config/api';

export type OnboardingStatusFilter = 'all' | 'completed' | 'pending';

export interface OnboardingAvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  intensity?: string | null;
  priority?: string | null;
}

export interface OnboardingProfileSummary {
  id: string;
  phone_number: string;
  name: string;
  surname: string;
  created_at: string;
  profile_type?: string | null;
  primary_goal?: string | null;
  target_date?: string | null;
  exam_type?: string | null;
  motivation?: string | null;
  study_focus_areas?: string[] | null;
  daily_available_minutes?: number | null;
  weekly_available_minutes?: number | null;
  preferred_study_times?: string | null;
  learning_style?: string | null;
  reminder_time?: string | null;
  profile_updated_at?: string | null;
  availability: OnboardingAvailabilitySlot[];
}

const mapAvailability = (raw: any): OnboardingAvailabilitySlot[] => {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.map((slot) => ({
    id: slot.id,
    dayOfWeek: slot.dayOfWeek ?? slot.day_of_week ?? 0,
    startTime: slot.startTime ?? slot.start_time ?? '',
    endTime: slot.endTime ?? slot.end_time ?? '',
    intensity: slot.intensity ?? null,
    priority: slot.priority ?? null,
  }));
};

const mapProfile = (raw: any): OnboardingProfileSummary => ({
  id: raw.id,
  phone_number: raw.phone_number,
  name: raw.name,
  surname: raw.surname,
  created_at: raw.created_at,
  profile_type: raw.profile_type ?? null,
  primary_goal: raw.primary_goal ?? null,
  target_date: raw.target_date ?? null,
  exam_type: raw.exam_type ?? null,
  motivation: raw.motivation ?? null,
  study_focus_areas: raw.study_focus_areas ?? null,
  daily_available_minutes: raw.daily_available_minutes ?? null,
  weekly_available_minutes: raw.weekly_available_minutes ?? null,
  preferred_study_times: raw.preferred_study_times ?? null,
  learning_style: raw.learning_style ?? null,
  reminder_time: raw.reminder_time ?? null,
  profile_updated_at: raw.profile_updated_at ?? null,
  availability: mapAvailability(raw.availability),
});

class OnboardingService {
  async getProfiles(status: OnboardingStatusFilter = 'all'): Promise<OnboardingProfileSummary[]> {
    const params =
      status && status !== 'all'
        ? {
            status,
          }
        : undefined;
    const response = await api.get('/admin/onboarding/profiles', {
      params,
    });
    const payload = response.data?.data ?? [];
    return Array.isArray(payload) ? payload.map(mapProfile) : [];
  }
}

export default new OnboardingService();
