export type Verdict = "winner" | "drop" | "watch";

export type SectionKey =
  | "pulse"
  | "signed_calls"
  | "mug_shots"
  | "fresh_ink"
  | "margin_read";

export type Day = 1 | 2 | 3;

export type Pace = "daily" | "weekly";

export interface Unit {
  id: string;
  name: string;
}

export interface Profile {
  userId: string;
  unitId: string;
  displayName: string;
  avatarUrl: string | null;
  email: string;
}

export interface Edition {
  id: string;
  unitId: string;
  weekNumber: number;
  publishedAt: string; // ISO date of the Monday this edition opens
}

export interface PulseBody {
  headline: string;
  number: string;
  paragraph: string;
  verdicts: { verdict: Verdict; label: string }[];
  pullQuote: string;
}

export interface FreshInkItem {
  home: string;
  bedrooms: number;
  status: "soft" | "recovered" | "new";
  tag: string;
  note: string;
}

export interface MarginReadBody {
  headline: string;
  paragraphs: string[];
  chartLabel: string;
  takeaway: string;
}

export interface Section {
  id: string;
  editionId: string;
  key: SectionKey;
  day: Day;
  title: string;
  unlockAt: string; // ISO datetime
}

export interface FlaggedHome {
  id: string;
  editionId: string;
  address: string;
  bedrooms: number;
  problem: string;
  verdict: Verdict;
}

export interface SignedCall {
  id: string;
  editionId: string;
  home: string;
  action: string;
  estValue: string;
  checkedDefault: boolean;
}

export interface ReaderPrefs {
  userId: string;
  editionId: string;
  pace: Pace;
}

export interface ReaderProgress {
  userId: string;
  sectionKey: SectionKey;
  readAt: string;
}

export interface SlackSend {
  id: string;
  unitId: string;
  editionId: string;
  channel: string;
  payload: unknown;
  sentAt: string;
}

export interface Session {
  userId: string;
  email: string;
  displayName: string;
  unitId: string;
  avatarUrl: string | null;
}
