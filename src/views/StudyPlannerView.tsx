import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  FileText,
  BarChart2,
  Star,
  Check,
  X,
  Timer,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { usePlanner } from '../context/PlannerContext';
import { Subject, Assignment, Exam, StudySession, RevisionTask } from '../types';
import { getDaysDifference, formatReadableDate } from '../utils/calendarUtils';

export const StudyPlannerView: React.FC = () => {
  const {
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
    selectedDate,
  } = usePlanner();

  // Subject Modal
  const [isSubjModalOpen, setIsSubjModalOpen] = useState(false);
  const [editingSubj, setEditingSubj] = useState<Subject | null>(null);
  const [subjName, setSubjName] = useState('');
  const [subjCode, setSubjCode] = useState('');
  const [subjColor, setSubjColor] = useState('#0284C7');
  const [subjInstructor, setSubjInstructor] = useState('');
  const [subjCredits, setSubjCredits] = useState(4);
  const [subjProgress, setSubjProgress] = useState(50);
  const [subjNotes, setSubjNotes] = useState('');

  // Assignment Modal
  const [isAsgModalOpen, setIsAsgModalOpen] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubjId, setAsgSubjId] = useState(subjects[0]?.id || '');
  const [asgDueDate, setAsgDueDate] = useState('2027-02-01');
  const [asgStatus, setAsgStatus] = useState<Assignment['status']>('pending');
  const [asgGrade, setAsgGrade] = useState('');
  const [asgNotes, setAsgNotes] = useState('');

  // Exam Modal
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [examSubjId, setExamSubjId] = useState(subjects[0]?.id || '');
  const [examDate, setExamDate] = useState('2027-04-15');
  const [examTime, setExamTime] = useState('10:00 - 13:00');
  const [examRoom, setExamRoom] = useState('Hall 101');
  const [examTopicsInput, setExamTopicsInput] = useState('');

  // Study Session Log Modal
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionSubjId, setSessionSubjId] = useState(subjects[0]?.id || '');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionRating, setSessionRating] = useState(5);

  // New Revision input
  const [revSubjId, setRevSubjId] = useState(subjects[0]?.id || '');
  const [revTopic, setRevTopic] = useState('');
  const [revDate, setRevDate] = useState(selectedDate);

  // Subject Handlers
  const openAddSubject = () => {
    setEditingSubj(null);
    setSubjName('');
    setSubjCode('');
    setSubjColor('#0284C7');
    setSubjInstructor('');
    setSubjCredits(4);
    setSubjProgress(0);
    setSubjNotes('');
    setIsSubjModalOpen(true);
  };

  const openEditSubject = (s: Subject) => {
    setEditingSubj(s);
    setSubjName(s.name);
    setSubjCode(s.code);
    setSubjColor(s.color);
    setSubjInstructor(s.instructor || '');
    setSubjCredits(s.credits);
    setSubjProgress(s.syllabusProgress);
    setSubjNotes(s.notes || '');
    setIsSubjModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjName.trim()) return;

    if (editingSubj) {
      updateSubject(editingSubj.id, {
        name: subjName.trim(),
        code: subjCode.trim(),
        color: subjColor,
        instructor: subjInstructor.trim() || undefined,
        credits: Number(subjCredits),
        syllabusProgress: Number(subjProgress),
        notes: subjNotes.trim() || undefined,
      });
    } else {
      addSubject({
        name: subjName.trim(),
        code: subjCode.trim(),
        color: subjColor,
        instructor: subjInstructor.trim() || undefined,
        credits: Number(subjCredits),
        syllabusProgress: Number(subjProgress),
        notes: subjNotes.trim() || undefined,
      });
    }
    setIsSubjModalOpen(false);
  };

  // Assignment Handler
  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;
    addAssignment({
      title: asgTitle.trim(),
      subjectId: asgSubjId,
      dueDate: asgDueDate,
      status: asgStatus,
      grade: asgGrade.trim() || undefined,
      notes: asgNotes.trim() || undefined,
    });
    setIsAsgModalOpen(false);
    setAsgTitle('');
    setAsgNotes('');
  };

  // Exam Handler
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;
    const topics = examTopicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addExam({
      title: examTitle.trim(),
      subjectId: examSubjId,
      date: examDate,
      time: examTime,
      room: examRoom.trim() || undefined,
      syllabusTopics: topics,
    });
    setIsExamModalOpen(false);
    setExamTitle('');
    setExamTopicsInput('');
  };

  // Session Log Handler
  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTopic.trim()) return;
    addStudySession({
      subjectId: sessionSubjId,
      date: selectedDate,
      durationMinutes: Number(sessionDuration),
      topic: sessionTopic.trim(),
      productivityRating: Number(sessionRating),
    });
    setIsSessionModalOpen(false);
    setSessionTopic('');
  };

  // Revision Handler
  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revTopic.trim()) return;
    addRevision({
      subjectId: revSubjId,
      topic: revTopic.trim(),
      scheduledDate: revDate,
      completed: false,
    });
    setRevTopic('');
  };

  // Compute total study hours logged
  const totalMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Subject study hours data for Recharts
  const subjectHoursData = useMemo(() => {
    return subjects.map((subj) => {
      const mins = studySessions
        .filter((s) => s.subjectId === subj.id)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      return {
        name: subj.code || subj.name.slice(0, 10),
        fullName: subj.name,
        hours: Number((mins / 60).toFixed(1)),
        color: subj.color,
      };
    });
  }, [subjects, studySessions]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header & Overview Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-bold mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-brand-500" />
            <span>Academic Excellence 2027</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
            Student & Academic Planner
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Subject roadmaps, assignment deadlines, exam countdowns & study session logs.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsSessionModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
          >
            <Timer className="w-4 h-4 text-brand-500" />
            Log Study Session
          </button>
          <button
            type="button"
            onClick={openAddSubject}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Active Subjects</p>
            <h3 className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {subjects.length} Courses
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-500">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Total Study Hours</p>
            <h3 className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {totalHours} hrs
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Upcoming Exams</p>
            <h3 className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {exams.length} Exams
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* EXAM COUNTDOWN TICKER CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            2027 Exam Countdown & Timetable
          </h3>
          <button
            type="button"
            onClick={() => setIsExamModalOpen(true)}
            className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule Exam
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {exams.map((exam) => {
            const subj = subjects.find((s) => s.id === exam.subjectId);
            const daysLeft = getDaysDifference(selectedDate, exam.date);

            return (
              <div
                key={exam.id}
                className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between space-y-3 relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: subj?.color || '#0284C7' }}
                />

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="font-bold uppercase tracking-wider">{subj?.code}</span>
                    <button
                      type="button"
                      onClick={() => deleteExam(exam.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {exam.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-500" /> {exam.date}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    ⏰ {exam.time} • 📍 {exam.room || 'TBD'}
                  </p>
                </div>

                {/* Countdown Badge */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Countdown</span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                      daysLeft <= 7
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 animate-pulse'
                        : 'bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Today!' : 'Completed'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SUBJECTS GRID WITH CUSTOM COLORS */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Subjects & Syllabus Progression
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: subj.color }}
                    />
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {subj.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {subj.code} • {subj.credits} Credits • {subj.instructor || 'Faculty'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEditSubject(subj)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSubject(subj.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {subj.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-navy-850 p-2.5 rounded-xl">
                    {subj.notes}
                  </p>
                )}
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Syllabus Completion</span>
                  <span className="font-mono font-bold" style={{ color: subj.color }}>
                    {subj.syllabusProgress}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={subj.syllabusProgress}
                    onChange={(e) =>
                      updateSubject(subj.id, { syllabusProgress: Number(e.target.value) })
                    }
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TWO COLUMN SECTION: ASSIGNMENTS & REVISION VS STUDY HOURS CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Assignment Tracker & Revision Planner */}
        <div className="lg:col-span-7 space-y-6">
          {/* Assignment Tracker */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Assignment & Project Tracker
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAsgModalOpen(true)}
                className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Assignment
              </button>
            </div>

            <div className="space-y-2.5">
              {assignments.map((asg) => {
                const subj = subjects.find((s) => s.id === asg.subjectId);
                return (
                  <div
                    key={asg.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: subj?.color || '#0284C7' }}
                        />
                        <span className="text-[10px] font-bold uppercase text-slate-500">
                          {subj?.code}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">• Due {asg.dueDate}</span>
                      </div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {asg.title}
                      </h5>
                      {asg.notes && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          {asg.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={asg.status}
                        onChange={(e) =>
                          updateAssignment(asg.id, { status: e.target.value as any })
                        }
                        className="text-xs font-semibold px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="submitted">Submitted</option>
                        <option value="graded">Graded</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => deleteAssignment(asg.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revision Planner (Spaced Repetition Checklist) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Spaced Revision Planner
                </h3>
              </div>
            </div>

            <form onSubmit={handleAddRevision} className="flex flex-wrap gap-2">
              <select
                value={revSubjId}
                onChange={(e) => setRevSubjId(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                value={revTopic}
                onChange={(e) => setRevTopic(e.target.value)}
                placeholder="Topic for scheduled revision..."
                className="flex-1 min-w-[180px] px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
              />
              <input
                type="date"
                value={revDate}
                onChange={(e) => setRevDate(e.target.value)}
                className="px-2 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold"
              >
                Schedule
              </button>
            </form>

            <div className="space-y-2">
              {revisions.map((rev) => {
                const subj = subjects.find((s) => s.id === rev.subjectId);
                return (
                  <div
                    key={rev.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleRevision(rev.id)}
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          rev.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-navy-900'
                        }`}
                      >
                        {rev.completed && <Check className="w-3 h-3" />}
                      </button>
                      <span className="text-[10px] font-bold uppercase text-brand-600 dark:text-brand-400">
                        [{subj?.code}]
                      </span>
                      <span
                        className={`text-xs font-medium truncate ${
                          rev.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {rev.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                        {rev.scheduledDate}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteRevision(rev.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Study Hours Chart & Recent Study Sessions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Study Hours Recharts Bar Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-brand-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Study Hours Breakdown
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">{totalHours}h total</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" fontSize={11} stroke="#94A3B8" />
                  <YAxis fontSize={11} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="hours" fill="#0284C7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Study Session Logs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Clock className="w-4 h-4 text-emerald-500" />
              Recent Study Sessions Logged
            </h4>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              {studySessions.slice(0, 5).map((ss) => {
                const subj = subjects.find((s) => s.id === ss.subjectId);
                return (
                  <div
                    key={ss.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        [{subj?.code}] {ss.topic}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {ss.date} • {ss.durationMinutes} mins • Rating: {ss.productivityRating}/5 ⭐
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteStudySession(ss.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SUBJECT MODAL */}
      {isSubjModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingSubj ? 'Edit Subject' : 'Add Academic Subject'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSubjModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={subjName}
                  onChange={(e) => setSubjName(e.target.value)}
                  placeholder="e.g. Distributed Systems & Cloud..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={subjCode}
                    onChange={(e) => setSubjCode(e.target.value)}
                    placeholder="CS-701"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Color Accent
                  </label>
                  <input
                    type="color"
                    value={subjColor}
                    onChange={(e) => setSubjColor(e.target.value)}
                    className="w-full h-9 p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Instructor / Professor
                  </label>
                  <input
                    type="text"
                    value={subjInstructor}
                    onChange={(e) => setSubjInstructor(e.target.value)}
                    placeholder="Dr. Ramanathan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={subjCredits}
                    onChange={(e) => setSubjCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Syllabus Progress: {subjProgress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subjProgress}
                  onChange={(e) => setSubjProgress(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Notes / Key Concepts
                </label>
                <textarea
                  rows={2}
                  value={subjNotes}
                  onChange={(e) => setSubjNotes(e.target.value)}
                  placeholder="Focus topics, textbook references..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubjModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGNMENT MODAL */}
      {isAsgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Add Assignment / Lab
              </h3>
              <button
                type="button"
                onClick={() => setIsAsgModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. Raft Consensus Implementation..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={asgSubjId}
                    onChange={(e) => setAsgSubjId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={asgStatus}
                  onChange={(e) => setAsgStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="graded">Graded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Submission Link
                </label>
                <textarea
                  rows={2}
                  value={asgNotes}
                  onChange={(e) => setAsgNotes(e.target.value)}
                  placeholder="GitHub repo, rubric specifications..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAsgModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXAM MODAL */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Schedule Exam
              </h3>
              <button
                type="button"
                onClick={() => setIsExamModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Midterm..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={examSubjId}
                    onChange={(e) => setExamSubjId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    placeholder="10:00 - 13:00"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Room / Hall
                  </label>
                  <input
                    type="text"
                    value={examRoom}
                    onChange={(e) => setExamRoom(e.target.value)}
                    placeholder="Hall 302"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Syllabus Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={examTopicsInput}
                  onChange={(e) => setExamTopicsInput(e.target.value)}
                  placeholder="Paxos, Raft, Vector Clocks, Chandy-Lamport"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm"
                >
                  Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SESSION LOG MODAL */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Log Completed Study Session
              </h3>
              <button
                type="button"
                onClick={() => setIsSessionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={sessionSubjId}
                    onChange={(e) => setSessionSubjId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / What was studied *
                </label>
                <input
                  type="text"
                  required
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  placeholder="e.g. Self-Attention equations, LeetCode Trees..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Focus Rating: {sessionRating} / 5 ⭐
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sessionRating}
                  onChange={(e) => setSessionRating(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm"
                >
                  Log Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
