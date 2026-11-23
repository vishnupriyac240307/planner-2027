export type Priority = 'low' | 'medium' | 'high';
export type TaskCategory = 'work' | 'study' | 'personal' | 'health' | 'finance' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  priority: Priority;
  category: TaskCategory;
  completed: boolean;
  subtasks?: { id: string; title: string; completed: boolean }[];
  tags?: string[];
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: 'work' | 'study' | 'personal' | 'holiday' | 'exam' | 'festival' | 'other';
  color?: string;
  location?: string;
  isAllDay?: boolean;
  notes?: string;
}

export interface DailyReflection {
  wentWell: string;
  improveTomorrow: string;
  mood: number; // 1 to 5
  waterGlasses: number; // 0 to 8
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  topPriorities: string[]; // 3 items
  hourlySchedule: Record<string, string>; // "05:00": "Wake up, morning walk", etc.
  dailyGoals: string[];
  studyPlan: string;
  workPlan: string;
  personalPlan: string;
  notes: string;
  reflection: DailyReflection;
}

export interface MonthlyPlan {
  month: number; // 1-12
  year: number; // 2027
  goals: string[];
  importantDatesNotes: string;
  monthlyTasks: { id: string; text: string; completed: boolean }[];
  focusTheme: string;
  achievements: string[];
  monthlyReflection: string;
  endOfMonthReview: string;
}

export type GoalCategory =
  | 'personal'
  | 'academic'
  | 'career'
  | 'financial'
  | 'health'
  | 'skills'
  | 'books'
  | 'projects'
  | 'places'
  | 'experiences';

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  deadline: string; // YYYY-MM-DD
  priority: Priority;
  progress: number; // 0 to 100
  target: string;
  notes?: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface VisionBoardItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  caption: string;
  quote?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  instructor?: string;
  credits: number;
  syllabusProgress: number; // 0 to 100
  notes?: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  status: 'pending' | 'in-progress' | 'submitted' | 'graded';
  grade?: string;
  notes?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  room?: string;
  syllabusTopics: string[];
}

export interface StudySession {
  id: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  topic: string;
  productivityRating: number; // 1-5
  notes?: string;
}

export interface RevisionTask {
  id: string;
  subjectId: string;
  topic: string;
  scheduledDate: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  targetDaysPerWeek: number;
  daysCompleted: Record<string, boolean>; // "2027-01-01": true
}

export type TransactionType = 'income' | 'expense' | 'savings';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  paymentMethod?: string;
}

export interface BudgetLimit {
  category: string;
  monthlyLimit: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export type MoodType = 'ecstatic' | 'happy' | 'neutral' | 'tired' | 'stressed' | 'sad';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: MoodType;
  gratitude: string[];
  brainDump?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
}

export type ImportantDateType =
  | 'festival'
  | 'holiday'
  | 'birthday'
  | 'anniversary'
  | 'exam'
  | 'deadline'
  | 'personal';

export interface ImportantDate {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: ImportantDateType;
  notes?: string;
  isRegionalVar?: boolean; // For Indian lunar calendar variation notification
}

export interface UserSettings {
  userName: string;
  userQuote: string;
  dailyFocus: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export type ActiveView =
  | 'dashboard'
  | 'calendar'
  | 'daily'
  | 'monthly'
  | 'goals'
  | 'study'
  | 'habits'
  | 'finance'
  | 'journal'
  | 'important-dates'
  | 'settings';
