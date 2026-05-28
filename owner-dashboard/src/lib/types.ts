// ─── GymOS Myanmar — Shared Type Definitions ─────────────────────────────────

export type PlanType = 'Basic' | 'Premium' | 'Premium Plus' | 'Student';
export type PaymentMethod = 'KBZPay' | 'Cash' | 'WavePay' | 'Bank Transfer' | 'CB Pay';
export type PaymentStatus = 'Paid' | 'Overdue' | 'Unpaid';
export type MemberStatus = 'Active' | 'Expired' | 'Suspended';
export type ExpenseCategory =
  | 'Rent'
  | 'Utilities'
  | 'Equipment'
  | 'Salaries'
  | 'Maintenance'
  | 'Other';
export type NotificationType = 'expiring' | 'overdue' | 'churn';
export type AccountRole = 'member' | 'trainer';
export type AccountStatus = 'Active' | 'Pending';
export type TrainerStatus = 'Active' | 'On Leave' | 'Inactive';

export interface Member {
  id: string;
  name: string;
  nameMM: string;
  initials: string;
  plan: PlanType;
  status: MemberStatus;
  /** ISO 'YYYY-MM-DD' */
  joinDate: string;
  /** ISO 'YYYY-MM-DD' */
  expiryDate: string;
  /** ISO 'YYYY-MM-DD' or null */
  lastVisitDate: string | null;
  phone: string;
  paymentStatus: PaymentStatus;
  /** ISO 'YYYY-MM-DD' — when the next/overdue payment is due */
  paymentDueDate: string | null;
  trainerId: string | null;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  /** ISO 'YYYY-MM-DD' */
  date: string;
  note: string;
}

export interface CheckIn {
  id: string;
  memberId: string;
  memberName: string;
  memberNameMM: string;
  /** ISO datetime */
  timestamp: string;
  isOverride?: boolean;
}

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  plan: PlanType;
  amount: number;
  method: PaymentMethod;
  /** ISO 'YYYY-MM-DD' */
  date: string;
  type: 'New' | 'Renewal';
}

export interface GymNotification {
  id: string;
  type: NotificationType;
  message: string;
  memberName: string;
  memberId: string;
  /** ISO datetime */
  timestamp: string;
  read: boolean;
}

export interface GymAccount {
  id: string;
  role: AccountRole;
  name: string;
  username: string;
  password: string;
  phone: string;
  planOrSpecialty: string;
  status: AccountStatus;
  createdAt: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  certifications: string[];
  monthlySalary: number;
  status: TrainerStatus;
  schedule: string;
  sessionsCompleted: number;
  retentionRate: number;
  revenueGenerated: number;
}
