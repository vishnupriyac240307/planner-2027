import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Task,
  CalendarEvent,
  DailyPlan,
  MonthlyPlan,
  Goal,
  VisionBoardItem,
  Subject,
  Assignment,
  Exam,
  StudySession,
  RevisionTask,
  Habit,
  Transaction,
  BudgetLimit,
  FinancialGoal,
  JournalEntry,
  ImportantDate,
  UserSettings,
  ActiveView,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_IMPORTANT_DATES,
  INITIAL_TASKS,
  INITIAL_EVENTS,
  INITIAL_DAILY_PLAN,
  INITIAL_MONTHLY_PLANS,
  INITIAL_GOALS,
  INITIAL_VISION_ITEMS,
  INITIAL_SUBJECTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
  INITIAL_STUDY_SESSIONS,
  INITIAL_REVISIONS,
  INITIAL_HABITS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGET_LIMITS,
  INITIAL_FINANCIAL_GOALS,
  INITIAL_JOURNAL_ENTRIES,
} from '../data/initialData';

interface PlannerContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedDate: string; // 'YYYY-MM-DD'
  setSelectedDate: (date: string) => void;
  selectedMonth: number; // 1-12
  setSelectedMonth: (m: number) => void;
  
  settings: UserSettings;
  updateSettings: (s: Partial<UserSettings>) => void;
  
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  events: CalendarEvent[];
  addEvent: (evt: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  dailyPlans: Record<string, DailyPlan>;
  getDailyPlan: (date: string) => DailyPlan;
  updateDailyPlan: (date: string, updates: Partial<DailyPlan>) => void;

  monthlyPlans: Record<number, MonthlyPlan>;
  getMonthlyPlan: (m: number) => MonthlyPlan;
  updateMonthlyPlan: (m: number, updates: Partial<MonthlyPlan>) => void;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  visionItems: VisionBoardItem[];
  addVisionItem: (item: Omit<VisionBoardItem, 'id'>) => void;
  deleteVisionItem: (id: string) => void;

  subjects: Subject[];
  addSubject: (subj: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  assignments: Assignment[];
  addAssignment: (asg: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  studySessions: StudySession[];
  addStudySession: (session: Omit<StudySession, 'id'>) => void;
  deleteStudySession: (id: string) => void;

  revisions: RevisionTask[];
  addRevision: (rev: Omit<RevisionTask, 'id'>) => void;
  toggleRevision: (id: string) => void;
  deleteRevision: (id: string) => void;

  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'daysCompleted'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDay: (habitId: string, dateStr: string) => void;

  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  budgetLimits: BudgetLimit[];
  updateBudgetLimit: (category: string, limit: number) => void;

  financialGoals: FinancialGoal[];
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  updateFinancialGoal: (id: string, updates: Partial<FinancialGoal>) => void;
  deleteFinancialGoal: (id: string) => void;

  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  toggleFavoriteJournal: (id: string) => void;

  importantDates: ImportantDate[];
  addImportantDate: (item: Omit<ImportantDate, 'id'>) => void;
  updateImportantDate: (id: string, updates: Partial<ImportantDate>) => void;
  deleteImportantDate: (id: string) => void;

  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  toast: string | null;
  showToast: (msg: string) => void;

  exportData: () => void;
  importData: (jsonStr: string) => boolean;
  resetData: () => void;
}

const STORAGE_PREFIX = 'PLANNER_2027_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>('2027-01-01');
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // State slices
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadFromStorage('settings', INITIAL_SETTINGS)
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage('tasks', INITIAL_TASKS)
  );
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    loadFromStorage('events', INITIAL_EVENTS)
  );
  const [dailyPlans, setDailyPlans] = useState<Record<string, DailyPlan>>(() =>
    loadFromStorage('dailyPlans', { '2027-01-01': INITIAL_DAILY_PLAN })
  );
  const [monthlyPlans, setMonthlyPlans] = useState<Record<number, MonthlyPlan>>(() =>
    loadFromStorage('monthlyPlans', INITIAL_MONTHLY_PLANS)
  );
  const [goals, setGoals] = useState<Goal[]>(() =>
    loadFromStorage('goals', INITIAL_GOALS)
  );
  const [visionItems, setVisionItems] = useState<VisionBoardItem[]>(() =>
    loadFromStorage('visionItems', INITIAL_VISION_ITEMS)
  );
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    loadFromStorage('subjects', INITIAL_SUBJECTS)
  );
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    loadFromStorage('assignments', INITIAL_ASSIGNMENTS)
  );
  const [exams, setExams] = useState<Exam[]>(() =>
    loadFromStorage('exams', INITIAL_EXAMS)
  );
  const [studySessions, setStudySessions] = useState<StudySession[]>(() =>
    loadFromStorage('studySessions', INITIAL_STUDY_SESSIONS)
  );
  const [revisions, setRevisions] = useState<RevisionTask[]>(() =>
    loadFromStorage('revisions', INITIAL_REVISIONS)
  );
  const [habits, setHabits] = useState<Habit[]>(() =>
    loadFromStorage('habits', INITIAL_HABITS)
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage('transactions', INITIAL_TRANSACTIONS)
  );
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>(() =>
    loadFromStorage('budgetLimits', INITIAL_BUDGET_LIMITS)
  );
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(() =>
    loadFromStorage('financialGoals', INITIAL_FINANCIAL_GOALS)
  );
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() =>
    loadFromStorage('journalEntries', INITIAL_JOURNAL_ENTRIES)
  );
  const [importantDates, setImportantDates] = useState<ImportantDate[]>(() =>
    loadFromStorage('importantDates', INITIAL_IMPORTANT_DATES)
  );

  // Apply dark mode class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Sync to local storage
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('tasks', tasks), [tasks]);
  useEffect(() => saveToStorage('events', events), [events]);
  useEffect(() => saveToStorage('dailyPlans', dailyPlans), [dailyPlans]);
  useEffect(() => saveToStorage('monthlyPlans', monthlyPlans), [monthlyPlans]);
  useEffect(() => saveToStorage('goals', goals), [goals]);
  useEffect(() => saveToStorage('visionItems', visionItems), [visionItems]);
  useEffect(() => saveToStorage('subjects', subjects), [subjects]);
  useEffect(() => saveToStorage('assignments', assignments), [assignments]);
  useEffect(() => saveToStorage('exams', exams), [exams]);
  useEffect(() => saveToStorage('studySessions', studySessions), [studySessions]);
  useEffect(() => saveToStorage('revisions', revisions), [revisions]);
  useEffect(() => saveToStorage('habits', habits), [habits]);
  useEffect(() => saveToStorage('transactions', transactions), [transactions]);
  useEffect(() => saveToStorage('budgetLimits', budgetLimits), [budgetLimits]);
  useEffect(() => saveToStorage('financialGoals', financialGoals), [financialGoals]);
  useEffect(() => saveToStorage('journalEntries', journalEntries), [journalEntries]);
  useEffect(() => saveToStorage('importantDates', importantDates), [importantDates]);

  // Settings
  const updateSettings = (s: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
    showToast('Settings saved successfully');
  };

  // Tasks
  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
    showToast(`Task "${task.title}" added`);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Task updated');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task deleted');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) showToast('Task marked as completed! 🎉');
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  // Events
  const addEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const evt: CalendarEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [...prev, evt]);
    showToast(`Event "${evt.title}" scheduled`);
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast('Event updated');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Event removed');
  };

  // Daily Plan
  const getDailyPlan = (date: string): DailyPlan => {
    if (dailyPlans[date]) return dailyPlans[date];
    return {
      date,
      topPriorities: ['', '', ''],
      hourlySchedule: {},
      dailyGoals: [],
      studyPlan: '',
      workPlan: '',
      personalPlan: '',
      notes: '',
      reflection: {
        wentWell: '',
        improveTomorrow: '',
        mood: 4,
        waterGlasses: 4,
      },
    };
  };

  const updateDailyPlan = (date: string, updates: Partial<DailyPlan>) => {
    setDailyPlans((prev) => {
      const current = prev[date] || getDailyPlan(date);
      return {
        ...prev,
        [date]: { ...current, ...updates },
      };
    });
    showToast('Daily plan saved');
  };

  // Monthly Plan
  const getMonthlyPlan = (month: number): MonthlyPlan => {
    if (monthlyPlans[month]) return monthlyPlans[month];
    return {
      month,
      year: 2027,
      goals: [],
      importantDatesNotes: '',
      monthlyTasks: [],
      focusTheme: '',
      achievements: [],
      monthlyReflection: '',
      endOfMonthReview: '',
    };
  };

  const updateMonthlyPlan = (month: number, updates: Partial<MonthlyPlan>) => {
    setMonthlyPlans((prev) => {
      const current = prev[month] || getMonthlyPlan(month);
      return {
        ...prev,
        [month]: { ...current, ...updates },
      };
    });
    showToast('Monthly plan updated');
  };

  // Goals
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = { ...goal, id: `goal-${Date.now()}` };
    setGoals((prev) => [...prev, newGoal]);
    showToast(`Goal "${newGoal.title}" added`);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showToast('Goal updated');
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal removed');
  };

  // Vision Items
  const addVisionItem = (item: Omit<VisionBoardItem, 'id'>) => {
    const newItem: VisionBoardItem = { ...item, id: `vb-${Date.now()}` };
    setVisionItems((prev) => [...prev, newItem]);
    showToast('Vision board item added');
  };

  const deleteVisionItem = (id: string) => {
    setVisionItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Vision item removed');
  };

  // Study: Subjects
  const addSubject = (subj: Omit<Subject, 'id'>) => {
    const newSubj: Subject = { ...subj, id: `subj-${Date.now()}` };
    setSubjects((prev) => [...prev, newSubj]);
    showToast(`Subject "${newSubj.name}" added`);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Subject updated');
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    showToast('Subject deleted');
  };

  // Assignments
  const addAssignment = (asg: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = { ...asg, id: `asg-${Date.now()}` };
    setAssignments((prev) => [...prev, newAsg]);
    showToast(`Assignment added`);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Assignment updated');
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    showToast('Assignment deleted');
  };

  // Exams
  const addExam = (exam: Omit<Exam, 'id'>) => {
    const newExam: Exam = { ...exam, id: `exam-${Date.now()}` };
    setExams((prev) => [...prev, newExam]);
    showToast('Exam scheduled');
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast('Exam updated');
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    showToast('Exam deleted');
  };

  // Study Sessions
  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = { ...session, id: `ss-${Date.now()}` };
    setStudySessions((prev) => [newSession, ...prev]);
    showToast('Study session logged! 📚');
  };

  const deleteStudySession = (id: string) => {
    setStudySessions((prev) => prev.filter((s) => s.id !== id));
    showToast('Study session removed');
  };

  // Revisions
  const addRevision = (rev: Omit<RevisionTask, 'id'>) => {
    const newRev: RevisionTask = { ...rev, id: `rev-${Date.now()}` };
    setRevisions((prev) => [...prev, newRev]);
    showToast('Revision task scheduled');
  };

  const toggleRevision = (id: string) => {
    setRevisions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteRevision = (id: string) => {
    setRevisions((prev) => prev.filter((r) => r.id !== id));
    showToast('Revision task removed');
  };

  // Habits
  const addHabit = (habit: Omit<Habit, 'id' | 'daysCompleted'>) => {
    const newHabit: Habit = {
      ...habit,
      id: `habit-${Date.now()}`,
      daysCompleted: {},
    };
    setHabits((prev) => [...prev, newHabit]);
    showToast(`Habit "${newHabit.name}" created`);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    showToast('Habit updated');
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    showToast('Habit deleted');
  };

  const toggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isDone = !!h.daysCompleted[dateStr];
          const updatedDays = { ...h.daysCompleted, [dateStr]: !isDone };
          if (!isDone) showToast(`Habit "${h.name}" completed for ${dateStr}! ⭐`);
          return { ...h, daysCompleted: updatedDays };
        }
        return h;
      })
    );
  };

  // Finance: Transactions
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...tx, id: `tx-${Date.now()}` };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('Transaction recorded');
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Transaction updated');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed');
  };

  const updateBudgetLimit = (category: string, limit: number) => {
    setBudgetLimits((prev) => {
      const exists = prev.find((b) => b.category === category);
      if (exists) {
        return prev.map((b) => (b.category === category ? { ...b, monthlyLimit: limit } : b));
      }
      return [...prev, { category, monthlyLimit: limit }];
    });
    showToast(`Budget limit updated for ${category}`);
  };

  // Financial Goals
  const addFinancialGoal = (goal: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = { ...goal, id: `fg-${Date.now()}` };
    setFinancialGoals((prev) => [...prev, newGoal]);
    showToast('Financial goal added');
  };

  const updateFinancialGoal = (id: string, updates: Partial<FinancialGoal>) => {
    setFinancialGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showToast('Financial goal updated');
  };

  const deleteFinancialGoal = (id: string) => {
    setFinancialGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Financial goal removed');
  };

  // Journal
  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `j-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    showToast('Journal entry saved 📖');
  };

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    setJournalEntries((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
    showToast('Journal entry updated');
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((j) => j.id !== id));
    showToast('Journal entry deleted');
  };

  const toggleFavoriteJournal = (id: string) => {
    setJournalEntries((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isFavorite: !j.isFavorite } : j))
    );
  };

  // Important Dates
  const addImportantDate = (item: Omit<ImportantDate, 'id'>) => {
    const newItem: ImportantDate = { ...item, id: `id-${Date.now()}` };
    setImportantDates((prev) => [...prev, newItem]);
    showToast(`Important date "${newItem.title}" added`);
  };

  const updateImportantDate = (id: string, updates: Partial<ImportantDate>) => {
    setImportantDates((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Important date updated');
  };

  const deleteImportantDate = (id: string) => {
    setImportantDates((prev) => prev.filter((d) => d.id !== id));
    showToast('Important date removed');
  };

  // Export / Import / Reset
  const exportData = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      tasks,
      events,
      dailyPlans,
      monthlyPlans,
      goals,
      visionItems,
      subjects,
      assignments,
      exams,
      studySessions,
      revisions,
      habits,
      transactions,
      budgetLimits,
      financialGoals,
      journalEntries,
      importantDates,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planner-2027-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Complete 2027 Planner backup downloaded! 💾');
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.settings) setSettings(data.settings);
      if (data.tasks) setTasks(data.tasks);
      if (data.events) setEvents(data.events);
      if (data.dailyPlans) setDailyPlans(data.dailyPlans);
      if (data.monthlyPlans) setMonthlyPlans(data.monthlyPlans);
      if (data.goals) setGoals(data.goals);
      if (data.visionItems) setVisionItems(data.visionItems);
      if (data.subjects) setSubjects(data.subjects);
      if (data.assignments) setAssignments(data.assignments);
      if (data.exams) setExams(data.exams);
      if (data.studySessions) setStudySessions(data.studySessions);
      if (data.revisions) setRevisions(data.revisions);
      if (data.habits) setHabits(data.habits);
      if (data.transactions) setTransactions(data.transactions);
      if (data.budgetLimits) setBudgetLimits(data.budgetLimits);
      if (data.financialGoals) setFinancialGoals(data.financialGoals);
      if (data.journalEntries) setJournalEntries(data.journalEntries);
      if (data.importantDates) setImportantDates(data.importantDates);
      showToast('Data imported successfully! ✨');
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      showToast('Failed to import: Invalid JSON file');
      return false;
    }
  };

  const resetData = () => {
    setSettings(INITIAL_SETTINGS);
    setTasks(INITIAL_TASKS);
    setEvents(INITIAL_EVENTS);
    setDailyPlans({ '2027-01-01': INITIAL_DAILY_PLAN });
    setMonthlyPlans(INITIAL_MONTHLY_PLANS);
    setGoals(INITIAL_GOALS);
    setVisionItems(INITIAL_VISION_ITEMS);
    setSubjects(INITIAL_SUBJECTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setExams(INITIAL_EXAMS);
    setStudySessions(INITIAL_STUDY_SESSIONS);
    setRevisions(INITIAL_REVISIONS);
    setHabits(INITIAL_HABITS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgetLimits(INITIAL_BUDGET_LIMITS);
    setFinancialGoals(INITIAL_FINANCIAL_GOALS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setImportantDates(INITIAL_IMPORTANT_DATES);
    showToast('Planner reset to pristine initial state 🔄');
  };

  return (
    <PlannerContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedDate,
        setSelectedDate,
        selectedMonth,
        setSelectedMonth,
        settings,
        updateSettings,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        dailyPlans,
        getDailyPlan,
        updateDailyPlan,
        monthlyPlans,
        getMonthlyPlan,
        updateMonthlyPlan,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        visionItems,
        addVisionItem,
        deleteVisionItem,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        exams,
        addExam,
        updateExam,
        deleteExam,
        studySessions,
        addStudySession,
        deleteStudySession,
        revisions,
        addRevision,
        toggleRevision,
        deleteRevision,
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitDay,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budgetLimits,
        updateBudgetLimit,
        financialGoals,
        addFinancialGoal,
        updateFinancialGoal,
        deleteFinancialGoal,
        journalEntries,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        toggleFavoriteJournal,
        importantDates,
        addImportantDate,
        updateImportantDate,
        deleteImportantDate,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isSearchOpen,
        setIsSearchOpen,
        toast,
        showToast,
        exportData,
        importData,
        resetData,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
