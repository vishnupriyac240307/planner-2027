export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MONTH_SHORT_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const HOURS_LIST = [
  '05:00', '06:00', '07:00', '08:00', '09:00', '10:00',
  '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  // month: 1 to 12
  const daysMap = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysMap[month - 1];
}

export function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${padZero(month)}-${padZero(day)}`;
}

export interface CalendarDayCell {
  day: number;
  month: number;
  year: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  dayOfWeek: number; // 0-6
}

export function getMonthCalendarGrid(year: number, month: number, selectedDate?: string): CalendarDayCell[] {
  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 is Sunday
  
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const cells: CalendarDayCell[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dateStr = formatDateKey(prevYear, prevMonth, day);
    const dayOfWeek = new Date(prevYear, prevMonth - 1, day).getDay();
    cells.push({
      day,
      month: prevMonth,
      year: prevYear,
      dateStr,
      isCurrentMonth: false,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isToday: selectedDate ? dateStr === selectedDate : false,
      dayOfWeek,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const dateStr = formatDateKey(year, month, day);
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    cells.push({
      day,
      month,
      year,
      dateStr,
      isCurrentMonth: true,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isToday: selectedDate ? dateStr === selectedDate : false,
      dayOfWeek,
    });
  }

  // Next month leading days to complete full grid (multiple of 7, up to 35 or 42)
  const remainingCells = (7 - (cells.length % 7)) % 7;
  // If we want consistent 6 weeks (42 cells) or minimum necessary:
  const targetTotal = cells.length + remainingCells < 35 ? 35 : cells.length + remainingCells;
  const daysToAdd = targetTotal - cells.length;

  for (let day = 1; day <= daysToAdd; day++) {
    const dateStr = formatDateKey(nextYear, nextMonth, day);
    const dayOfWeek = new Date(nextYear, nextMonth - 1, day).getDay();
    cells.push({
      day,
      month: nextMonth,
      year: nextYear,
      dateStr,
      isCurrentMonth: false,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isToday: selectedDate ? dateStr === selectedDate : false,
      dayOfWeek,
    });
  }

  return cells;
}

export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const weekday = WEEKDAYS_FULL[dateObj.getDay()];
  const monthName = MONTH_NAMES[m - 1];
  return `${weekday}, ${monthName} ${d}, ${y}`;
}

export function formatShortReadable(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const monthShort = MONTH_SHORT_NAMES[m - 1];
  return `${monthShort} ${d}, ${y}`;
}

export function getDayOfYear(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  let dayCount = 0;
  for (let i = 1; i < m; i++) {
    dayCount += getDaysInMonth(y, i);
  }
  return dayCount + d;
}

export function get2027YearProgress(dateStr: string = '2027-01-01'): {
  dayNumber: number;
  totalDays: number;
  percentage: number;
} {
  const totalDays = 365;
  const dayNumber = Math.min(Math.max(getDayOfYear(dateStr), 1), totalDays);
  const percentage = Math.round((dayNumber / totalDays) * 100);
  return { dayNumber, totalDays, percentage };
}

export function getMonthProgress(dateStr: string): {
  dayNumber: number;
  totalDays: number;
  percentage: number;
} {
  const [y, m, d] = dateStr.split('-').map(Number);
  const totalDays = getDaysInMonth(y, m);
  const dayNumber = Math.min(Math.max(d, 1), totalDays);
  const percentage = Math.round((dayNumber / totalDays) * 100);
  return { dayNumber, totalDays, percentage };
}

export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${mStr || '00'} ${ampm}`;
}

export function getNextDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d + 1);
  return `${dateObj.getFullYear()}-${padZero(dateObj.getMonth() + 1)}-${padZero(dateObj.getDate())}`;
}

export function getPrevDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d - 1);
  return `${dateObj.getFullYear()}-${padZero(dateObj.getMonth() + 1)}-${padZero(dateObj.getDate())}`;
}

export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const time1 = new Date(y1, m1 - 1, d1).getTime();
  const time2 = new Date(y2, m2 - 1, d2).getTime();
  const diffTime = time2 - time1;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
