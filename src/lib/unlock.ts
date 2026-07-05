import type { Day, Pace } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;
const UNLOCK_HOUR = 7.5; // 7:30am local

/** Monday 00:00 local time of the ISO week containing `date`. */
function mondayOf(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dow = d.getDay(); // 0=Sun..6=Sat
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}

/**
 * The active edition's Monday: the Monday of the current week while we're
 * still inside its Mon-Wed reveal window, otherwise the upcoming Monday.
 */
export function currentEditionMonday(now: Date = new Date()): Date {
  const monday = mondayOf(now);
  const wednesdayEnd = new Date(monday.getTime() + 3 * DAY_MS); // Thu 00:00
  if (now.getTime() >= wednesdayEnd.getTime()) {
    return new Date(monday.getTime() + 7 * DAY_MS);
  }
  return monday;
}

export function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const diff = d.getTime() - firstThursday.getTime();
  return 1 + Math.round((diff / DAY_MS - ((d.getUTCDay() + 6) % 7) + 3) / 7);
}

export function dayUnlockAt(editionMonday: Date, day: Day): Date {
  const base = new Date(editionMonday.getTime() + (day - 1) * DAY_MS);
  base.setHours(0, 0, 0, 0);
  return new Date(base.getTime() + UNLOCK_HOUR * 60 * 60 * 1000);
}

export interface DayState {
  day: Day;
  unlocked: boolean;
  unlockAt: Date;
  countdownLabel: string | null;
}

/** Days elapsed since the edition's Monday, clamped to [0, 2] (Mon/Tue/Wed = 0/1/2). */
function daysElapsed(editionMonday: Date, now: Date): number {
  const mondayUnlock = dayUnlockAt(editionMonday, 1);
  const rawDays = Math.floor((now.getTime() - mondayUnlock.getTime()) / DAY_MS);
  return Math.min(2, Math.max(0, rawDays));
}

export function formatCountdown(now: Date, target: Date): string {
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return "soon";
  const hours = Math.round(diffMs / (60 * 60 * 1000));
  if (hours < 1) return `${Math.max(1, Math.round(diffMs / 60000))}m`;
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

export function getDayStates(
  editionMonday: Date,
  pace: Pace,
  now: Date = new Date()
): DayState[] {
  const elapsed = daysElapsed(editionMonday, now);
  const days: Day[] = [1, 2, 3];
  return days.map((day) => {
    const unlockAt = dayUnlockAt(editionMonday, day);
    const unlocked = pace === "weekly" ? true : day - 1 <= elapsed;
    return {
      day,
      unlocked,
      unlockAt,
      countdownLabel: unlocked ? null : formatCountdown(now, unlockAt),
    };
  });
}

export const DAY_LABELS: Record<Day, string> = { 1: "Mon", 2: "Tue", 3: "Wed" };
export const DAY_NAMES: Record<Day, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
};
