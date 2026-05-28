// ─── GymOS Myanmar — Seed Data ────────────────────────────────────────────────
// Reference date: 2026-05-28 (current local date at authoring time)
// All dateOffset() calls are relative to that reference.

import type {
  Member,
  Expense,
  CheckIn,
  PaymentRecord,
} from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REF = '2026-05-28';

function dateOffset(days: number): string {
  const d = new Date(REF);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export const PLAN_PRICES: Record<string, number> = {
  Basic: 80_000,
  Student: 60_000,
  Premium: 150_000,
  'Premium Plus': 200_000,
};

export const MONTHLY_REVENUE: Record<string, number> = {
  '2026-03': 21_200_000,
  '2026-04': 16_800_000,
  '2026-05': 18_400_000,
};

// ─── 20 Seed Members ──────────────────────────────────────────────────────────

export const seedMembers: Member[] = [
  // ── Expiring / at-risk for demo notifications ──
  {
    id: 'mem-01',
    name: 'Zaw Myint',
    nameMM: 'ဇော်မြင့်',
    initials: 'ZM',
    plan: 'Premium',
    status: 'Active',
    joinDate: dateOffset(-165),
    expiryDate: dateOffset(2),        // ⚠ expires in 2 days
    lastVisitDate: dateOffset(-23),   // 🔴 23 days ago → churn
    phone: '+95 9 7654 3210',
    paymentStatus: 'Overdue',
    paymentDueDate: dateOffset(-12),  // overdue 12 days
    trainerId: 't1',
  },
  {
    id: 'mem-02',
    name: 'Thin Thin Aye',
    nameMM: 'သင်းသင်းအေး',
    initials: 'TA',
    plan: 'Basic',
    status: 'Active',
    joinDate: dateOffset(-58),
    expiryDate: dateOffset(5),
    lastVisitDate: dateOffset(-18),   // 🔴 18 days → churn
    phone: '+95 9 8765 4321',
    paymentStatus: 'Unpaid',
    paymentDueDate: dateOffset(-8),   // overdue 8 days
    trainerId: null,
  },
  {
    id: 'mem-03',
    name: 'Kyaw Zin Htun',
    nameMM: 'ကျော်ဇင်ထွန်း',
    initials: 'KH',
    plan: 'Premium',
    status: 'Active',
    joinDate: dateOffset(-112),
    expiryDate: dateOffset(10),
    lastVisitDate: dateOffset(-15),   // 🔴 15 days → churn
    phone: '+95 9 9876 5432',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: 't2',
  },
  {
    id: 'mem-04',
    name: 'Su Su Lwin',
    nameMM: 'စုစုလွင်',
    initials: 'SL',
    plan: 'Basic',
    status: 'Active',
    joinDate: dateOffset(-95),
    expiryDate: dateOffset(1),        // ⚠ expires tomorrow
    lastVisitDate: dateOffset(-21),   // 🔴 21 days → churn
    phone: '+95 9 6543 2109',
    paymentStatus: 'Overdue',
    paymentDueDate: dateOffset(-8),
    trainerId: null,
  },
  {
    id: 'mem-05',
    name: 'Aung Ko Ko',
    nameMM: 'အောင်ကိုကို',
    initials: 'AK',
    plan: 'Premium Plus',
    status: 'Active',
    joinDate: dateOffset(-180),
    expiryDate: dateOffset(30),
    lastVisitDate: dateOffset(-12),   // 🔴 12 days (borderline)
    phone: '+95 9 5432 1098',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: 't1',
  },
  {
    id: 'mem-06',
    name: 'Ei Ei Mon',
    nameMM: 'အေးအေးမွန်',
    initials: 'EM',
    plan: 'Basic',
    status: 'Active',
    joinDate: dateOffset(-52),
    expiryDate: dateOffset(3),        // ⚠ expiring in 3 days (boundary)
    lastVisitDate: dateOffset(-19),   // 🔴 19 days → churn
    phone: '+95 9 4321 0987',
    paymentStatus: 'Unpaid',
    paymentDueDate: dateOffset(-7),   // exactly 7 days (boundary)
    trainerId: null,
  },
  {
    id: 'mem-07',
    name: 'Hla Myat',
    nameMM: 'လှမြတ်',
    initials: 'HM',
    plan: 'Premium',
    status: 'Active',
    joinDate: dateOffset(-135),
    expiryDate: dateOffset(15),
    lastVisitDate: dateOffset(-10),
    phone: '+95 9 3210 9876',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: 't3',
  },
  {
    id: 'mem-08',
    name: 'Ni Ni Aung',
    nameMM: 'နီနီအောင်',
    initials: 'NA',
    plan: 'Basic',
    status: 'Active',
    joinDate: dateOffset(-75),
    expiryDate: dateOffset(20),
    lastVisitDate: dateOffset(-9),
    phone: '+95 9 2109 8765',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: null,
  },
  {
    id: 'mem-09',
    name: 'Ko Thura',
    nameMM: 'ကိုသူရ',
    initials: 'KT',
    plan: 'Student',
    status: 'Active',
    joinDate: dateOffset(-55),
    expiryDate: dateOffset(25),
    lastVisitDate: dateOffset(-2),
    phone: '+95 9 1098 7654',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: null,
  },
  {
    id: 'mem-10',
    name: 'Ma Hnin',
    nameMM: 'မမ့နှင်း',
    initials: 'MH',
    plan: 'Premium',
    status: 'Active',
    joinDate: dateOffset(-200),
    expiryDate: dateOffset(45),
    lastVisitDate: dateOffset(-1),
    phone: '+95 9 0987 6543',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: 't1',
  },
  {
    id: 'mem-11',
    name: 'Win Ko Ko',
    nameMM: 'ဝင်းကိုကို',
    initials: 'WK',
    plan: 'Basic',
    status: 'Active',
    joinDate: dateOffset(-88),
    expiryDate: dateOffset(28),
    lastVisitDate: dateOffset(-3),
    phone: '+95 9 9876 0123',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: null,
  },
  {
    id: 'mem-12',
    name: 'Phyu Phyu Aye',
    nameMM: 'ဖြူဖြူအေး',
    initials: 'PA',
    plan: 'Premium Plus',
    status: 'Active',
    joinDate: dateOffset(-210),
    expiryDate: dateOffset(60),
    lastVisitDate: dateOffset(-5),
    phone: '+95 9 8765 1234',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: 't4',
  },
  {
    id: 'mem-13',
    name: 'Myo Zin',
    nameMM: 'မျိုးဇင်',
    initials: 'MZ',
    plan: 'Basic',
    status: 'Expired',            // 🔴 expired, did NOT renew → churn in reports
    joinDate: dateOffset(-145),
    expiryDate: dateOffset(-5),   // expired 5 days ago
    lastVisitDate: dateOffset(-25),
    phone: '+95 9 7654 2345',
    paymentStatus: 'Overdue',
    paymentDueDate: dateOffset(-15),
    trainerId: null,
  },
  {
    id: 'mem-14',
    name: 'Aye Chan',
    nameMM: 'အေးချမ်း',
    initials: 'AC',
    plan: 'Student',
    status: 'Active',
    joinDate: dateOffset(-66),
    expiryDate: dateOffset(12),
    lastVisitDate: dateOffset(-7),
    phone: '+95 9 6543 3456',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: null,
  },
  {
    id: 'mem-15',
    name: 'Kyaw Thu',
    nameMM: 'ကျော်သူ',
    initials: 'KT',
    plan: 'Premium',
    status: 'Active',
    joinDate: dateOffset(-155),
    expiryDate: dateOffset(35),
    lastVisitDate: dateOffset(-4),
    phone: '+95 9 5432 4567',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: 't2',
  },
  {
    id: 'mem-16',
    name: 'Nwe Nwe',
    nameMM: 'နွေနွေ',
    initials: 'NN',
    plan: 'Basic',
    status: 'Active',
    joinDate: dateOffset(-82),
    expiryDate: dateOffset(22),
    lastVisitDate: dateOffset(-6),
    phone: '+95 9 4321 5678',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: null,
  },
  {
    id: 'mem-17',
    name: 'Htun Htun',
    nameMM: 'ထွန်းထွန်း',
    initials: 'HH',
    plan: 'Premium',
    status: 'Active',
    joinDate: dateOffset(-120),
    expiryDate: dateOffset(2),        // ⚠ expires in 2 days
    lastVisitDate: dateOffset(-16),   // 🔴 16 days → churn
    phone: '+95 9 3210 6789',
    paymentStatus: 'Unpaid',
    paymentDueDate: dateOffset(-8),
    trainerId: 't3',
  },
  {
    id: 'mem-18',
    name: 'Wai Wai Phyo',
    nameMM: 'ဝိုင်ဝိုင်ဖြိုး',
    initials: 'WP',
    plan: 'Basic',
    status: 'Active',
    joinDate: dateOffset(-98),
    expiryDate: dateOffset(18),
    lastVisitDate: dateOffset(-8),
    phone: '+95 9 2109 7890',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: null,
  },
  {
    id: 'mem-19',
    name: 'Mg Mg Lwin',
    nameMM: 'မောင်မောင်လွင်',
    initials: 'ML',
    plan: 'Student',
    status: 'Active',
    joinDate: dateOffset(-72),
    expiryDate: dateOffset(8),
    lastVisitDate: dateOffset(-11),
    phone: '+95 9 1098 8901',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: null,
  },
  {
    id: 'mem-20',
    name: 'Sandar Aung',
    nameMM: 'စန်းဒါးအောင်',
    initials: 'SA',
    plan: 'Premium Plus',
    status: 'Active',
    joinDate: dateOffset(-240),
    expiryDate: dateOffset(90),
    lastVisitDate: dateOffset(-3),
    phone: '+95 9 0987 9012',
    paymentStatus: 'Paid',
    paymentDueDate: null,
    trainerId: 't4',
  },
];

// ─── 63 Payment Records (March / April / May 2026) ────────────────────────────

export const seedPaymentRecords: PaymentRecord[] = [
  // ── March 2026 (20 records) ────────────────────────────────────────────────
  { id: 'pay-m01', memberId: 'mem-01', memberName: 'Zaw Myint',     plan: 'Premium',      amount: 150_000, method: 'KBZPay',        date: '2026-03-05', type: 'Renewal' },
  { id: 'pay-m02', memberId: 'mem-02', memberName: 'Thin Thin Aye', plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-03-08', type: 'New' },
  { id: 'pay-m03', memberId: 'mem-03', memberName: 'Kyaw Zin Htun', plan: 'Premium',      amount: 150_000, method: 'WavePay',        date: '2026-03-10', type: 'Renewal' },
  { id: 'pay-m04', memberId: 'mem-04', memberName: 'Su Su Lwin',    plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-03-12', type: 'Renewal' },
  { id: 'pay-m05', memberId: 'mem-05', memberName: 'Aung Ko Ko',    plan: 'Premium Plus', amount: 200_000, method: 'Bank Transfer',  date: '2026-03-01', type: 'Renewal' },
  { id: 'pay-m06', memberId: 'mem-06', memberName: 'Ei Ei Mon',     plan: 'Basic',        amount:  80_000, method: 'KBZPay',         date: '2026-03-15', type: 'New' },
  { id: 'pay-m07', memberId: 'mem-07', memberName: 'Hla Myat',      plan: 'Premium',      amount: 150_000, method: 'KBZPay',         date: '2026-03-03', type: 'Renewal' },
  { id: 'pay-m08', memberId: 'mem-08', memberName: 'Ni Ni Aung',    plan: 'Basic',        amount:  80_000, method: 'WavePay',        date: '2026-03-18', type: 'New' },
  { id: 'pay-m09', memberId: 'mem-09', memberName: 'Ko Thura',      plan: 'Student',      amount:  60_000, method: 'Cash',           date: '2026-03-20', type: 'New' },
  { id: 'pay-m10', memberId: 'mem-10', memberName: 'Ma Hnin',       plan: 'Premium',      amount: 150_000, method: 'KBZPay',         date: '2026-03-02', type: 'Renewal' },
  { id: 'pay-m11', memberId: 'mem-11', memberName: 'Win Ko Ko',     plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-03-22', type: 'Renewal' },
  { id: 'pay-m12', memberId: 'mem-12', memberName: 'Phyu Phyu Aye', plan: 'Premium Plus', amount: 200_000, method: 'Bank Transfer',  date: '2026-03-04', type: 'Renewal' },
  { id: 'pay-m13', memberId: 'mem-13', memberName: 'Myo Zin',       plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-03-25', type: 'Renewal' },
  { id: 'pay-m14', memberId: 'mem-14', memberName: 'Aye Chan',      plan: 'Student',      amount:  60_000, method: 'KBZPay',         date: '2026-03-14', type: 'New' },
  { id: 'pay-m15', memberId: 'mem-15', memberName: 'Kyaw Thu',      plan: 'Premium',      amount: 150_000, method: 'WavePay',        date: '2026-03-07', type: 'Renewal' },
  { id: 'pay-m16', memberId: 'mem-16', memberName: 'Nwe Nwe',       plan: 'Basic',        amount:  80_000, method: 'CB Pay',          date: '2026-03-16', type: 'New' },
  { id: 'pay-m17', memberId: 'mem-17', memberName: 'Htun Htun',     plan: 'Premium',      amount: 150_000, method: 'KBZPay',         date: '2026-03-09', type: 'Renewal' },
  { id: 'pay-m18', memberId: 'mem-18', memberName: 'Wai Wai Phyo',  plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-03-19', type: 'Renewal' },
  { id: 'pay-m19', memberId: 'mem-19', memberName: 'Mg Mg Lwin',    plan: 'Student',      amount:  60_000, method: 'KBZPay',         date: '2026-03-21', type: 'New' },
  { id: 'pay-m20', memberId: 'mem-20', memberName: 'Sandar Aung',   plan: 'Premium Plus', amount: 200_000, method: 'Bank Transfer',  date: '2026-03-06', type: 'Renewal' },

  // ── April 2026 (21 records) ────────────────────────────────────────────────
  { id: 'pay-a01', memberId: 'mem-01', memberName: 'Zaw Myint',     plan: 'Premium',      amount: 150_000, method: 'KBZPay',         date: '2026-04-05', type: 'Renewal' },
  { id: 'pay-a02', memberId: 'mem-02', memberName: 'Thin Thin Aye', plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-04-08', type: 'Renewal' },
  { id: 'pay-a03', memberId: 'mem-03', memberName: 'Kyaw Zin Htun', plan: 'Premium',      amount: 150_000, method: 'WavePay',        date: '2026-04-10', type: 'Renewal' },
  { id: 'pay-a04', memberId: 'mem-04', memberName: 'Su Su Lwin',    plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-04-12', type: 'Renewal' },
  { id: 'pay-a05', memberId: 'mem-05', memberName: 'Aung Ko Ko',    plan: 'Premium Plus', amount: 200_000, method: 'Bank Transfer',  date: '2026-04-01', type: 'Renewal' },
  { id: 'pay-a06', memberId: 'mem-06', memberName: 'Ei Ei Mon',     plan: 'Basic',        amount:  80_000, method: 'KBZPay',         date: '2026-04-15', type: 'Renewal' },
  { id: 'pay-a07', memberId: 'mem-07', memberName: 'Hla Myat',      plan: 'Premium',      amount: 150_000, method: 'KBZPay',         date: '2026-04-03', type: 'Renewal' },
  { id: 'pay-a08', memberId: 'mem-08', memberName: 'Ni Ni Aung',    plan: 'Basic',        amount:  80_000, method: 'WavePay',        date: '2026-04-18', type: 'Renewal' },
  { id: 'pay-a09', memberId: 'mem-09', memberName: 'Ko Thura',      plan: 'Student',      amount:  60_000, method: 'Cash',           date: '2026-04-20', type: 'Renewal' },
  { id: 'pay-a10', memberId: 'mem-10', memberName: 'Ma Hnin',       plan: 'Premium',      amount: 150_000, method: 'KBZPay',         date: '2026-04-02', type: 'Renewal' },
  { id: 'pay-a11', memberId: 'mem-11', memberName: 'Win Ko Ko',     plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-04-22', type: 'Renewal' },
  { id: 'pay-a12', memberId: 'mem-12', memberName: 'Phyu Phyu Aye', plan: 'Premium Plus', amount: 200_000, method: 'Bank Transfer',  date: '2026-04-04', type: 'Renewal' },
  { id: 'pay-a13', memberId: 'mem-13', memberName: 'Myo Zin',       plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-04-25', type: 'Renewal' },
  { id: 'pay-a14', memberId: 'mem-14', memberName: 'Aye Chan',      plan: 'Student',      amount:  60_000, method: 'KBZPay',         date: '2026-04-14', type: 'Renewal' },
  { id: 'pay-a15', memberId: 'mem-15', memberName: 'Kyaw Thu',      plan: 'Premium',      amount: 150_000, method: 'WavePay',        date: '2026-04-07', type: 'Renewal' },
  { id: 'pay-a16', memberId: 'mem-16', memberName: 'Nwe Nwe',       plan: 'Basic',        amount:  80_000, method: 'CB Pay',          date: '2026-04-16', type: 'Renewal' },
  { id: 'pay-a17', memberId: 'mem-17', memberName: 'Htun Htun',     plan: 'Premium',      amount: 150_000, method: 'KBZPay',         date: '2026-04-09', type: 'Renewal' },
  { id: 'pay-a18', memberId: 'mem-18', memberName: 'Wai Wai Phyo',  plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-04-19', type: 'Renewal' },
  { id: 'pay-a19', memberId: 'mem-19', memberName: 'Mg Mg Lwin',    plan: 'Student',      amount:  60_000, method: 'KBZPay',         date: '2026-04-21', type: 'Renewal' },
  { id: 'pay-a20', memberId: 'mem-20', memberName: 'Sandar Aung',   plan: 'Premium Plus', amount: 200_000, method: 'Bank Transfer',  date: '2026-04-06', type: 'Renewal' },
  // New member in April
  { id: 'pay-a21', memberId: 'mem-xx', memberName: 'Thant Zin Oo',  plan: 'Basic',        amount:  80_000, method: 'KBZPay',         date: '2026-04-28', type: 'New' },

  // ── May 2026 (22 records) ──────────────────────────────────────────────────
  { id: 'pay-b01', memberId: 'mem-01', memberName: 'Zaw Myint',     plan: 'Premium',      amount: 150_000, method: 'KBZPay',         date: '2026-05-05', type: 'Renewal' },
  { id: 'pay-b02', memberId: 'mem-02', memberName: 'Thin Thin Aye', plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-05-08', type: 'Renewal' },
  { id: 'pay-b03', memberId: 'mem-03', memberName: 'Kyaw Zin Htun', plan: 'Premium',      amount: 150_000, method: 'WavePay',        date: '2026-05-10', type: 'Renewal' },
  { id: 'pay-b04', memberId: 'mem-04', memberName: 'Su Su Lwin',    plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-05-12', type: 'Renewal' },
  { id: 'pay-b05', memberId: 'mem-05', memberName: 'Aung Ko Ko',    plan: 'Premium Plus', amount: 200_000, method: 'Bank Transfer',  date: '2026-05-01', type: 'Renewal' },
  // mem-06 (Ei Ei Mon) did NOT pay in May → Unpaid
  { id: 'pay-b07', memberId: 'mem-07', memberName: 'Hla Myat',      plan: 'Premium',      amount: 150_000, method: 'KBZPay',         date: '2026-05-03', type: 'Renewal' },
  { id: 'pay-b08', memberId: 'mem-08', memberName: 'Ni Ni Aung',    plan: 'Basic',        amount:  80_000, method: 'WavePay',        date: '2026-05-18', type: 'Renewal' },
  { id: 'pay-b09', memberId: 'mem-09', memberName: 'Ko Thura',      plan: 'Student',      amount:  60_000, method: 'Cash',           date: '2026-05-20', type: 'Renewal' },
  { id: 'pay-b10', memberId: 'mem-10', memberName: 'Ma Hnin',       plan: 'Premium',      amount: 150_000, method: 'KBZPay',         date: '2026-05-02', type: 'Renewal' },
  { id: 'pay-b11', memberId: 'mem-11', memberName: 'Win Ko Ko',     plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-05-22', type: 'Renewal' },
  { id: 'pay-b12', memberId: 'mem-12', memberName: 'Phyu Phyu Aye', plan: 'Premium Plus', amount: 200_000, method: 'Bank Transfer',  date: '2026-05-04', type: 'Renewal' },
  // mem-13 (Myo Zin) did NOT pay in May → Expired
  { id: 'pay-b14', memberId: 'mem-14', memberName: 'Aye Chan',      plan: 'Student',      amount:  60_000, method: 'KBZPay',         date: '2026-05-14', type: 'Renewal' },
  { id: 'pay-b15', memberId: 'mem-15', memberName: 'Kyaw Thu',      plan: 'Premium',      amount: 150_000, method: 'WavePay',        date: '2026-05-07', type: 'Renewal' },
  { id: 'pay-b16', memberId: 'mem-16', memberName: 'Nwe Nwe',       plan: 'Basic',        amount:  80_000, method: 'CB Pay',          date: '2026-05-16', type: 'Renewal' },
  // mem-17 (Htun Htun) did NOT pay in May → Unpaid/overdue
  { id: 'pay-b18', memberId: 'mem-18', memberName: 'Wai Wai Phyo',  plan: 'Basic',        amount:  80_000, method: 'Cash',           date: '2026-05-19', type: 'Renewal' },
  { id: 'pay-b19', memberId: 'mem-19', memberName: 'Mg Mg Lwin',    plan: 'Student',      amount:  60_000, method: 'KBZPay',         date: '2026-05-21', type: 'Renewal' },
  { id: 'pay-b20', memberId: 'mem-20', memberName: 'Sandar Aung',   plan: 'Premium Plus', amount: 200_000, method: 'Bank Transfer',  date: '2026-05-06', type: 'Renewal' },
  // New members in May
  { id: 'pay-b21', memberId: 'mem-n1', memberName: 'Lin Lin Oo',    plan: 'Basic',        amount:  80_000, method: 'KBZPay',         date: '2026-05-10', type: 'New' },
  { id: 'pay-b22', memberId: 'mem-n2', memberName: 'Yan Naing',     plan: 'Premium',      amount: 150_000, method: 'WavePay',        date: '2026-05-15', type: 'New' },
  { id: 'pay-b23', memberId: 'mem-xx', memberName: 'Thant Zin Oo',  plan: 'Basic',        amount:  80_000, method: 'KBZPay',         date: '2026-05-26', type: 'Renewal' },
  { id: 'pay-b24', memberId: 'mem-n3', memberName: 'Phoe Wa',       plan: 'Student',      amount:  60_000, method: 'Cash',           date: '2026-05-22', type: 'New' },
];

// ─── Expense Records (April + May 2026) ───────────────────────────────────────

export const seedExpenses: Expense[] = [
  // ── April 2026 ────────────────────────────────────────────────────────────
  { id: 'exp-a01', category: 'Rent',        amount: 1_500_000, date: '2026-04-01', note: 'Monthly gym rent — Kamayut' },
  { id: 'exp-a02', category: 'Salaries',    amount:   800_000, date: '2026-04-01', note: 'Ma Thida — trainer salary' },
  { id: 'exp-a03', category: 'Salaries',    amount:   700_000, date: '2026-04-01', note: 'Ko Naing — trainer salary' },
  { id: 'exp-a04', category: 'Salaries',    amount:   650_000, date: '2026-04-01', note: 'Daw Yin Yin — trainer salary' },
  { id: 'exp-a05', category: 'Salaries',    amount:   750_000, date: '2026-04-01', note: 'Ko Pyae Phyo — trainer salary' },
  { id: 'exp-a06', category: 'Utilities',   amount:   450_000, date: '2026-04-05', note: 'Electricity — YESC bill' },
  { id: 'exp-a07', category: 'Utilities',   amount:   280_000, date: '2026-04-08', note: 'Generator diesel fuel' },
  { id: 'exp-a08', category: 'Equipment',   amount:   280_000, date: '2026-04-10', note: 'New dumbbell set (8-24kg)' },
  { id: 'exp-a09', category: 'Maintenance', amount:   180_000, date: '2026-04-15', note: 'AC compressor repair' },
  { id: 'exp-a10', category: 'Other',       amount:    85_000, date: '2026-04-20', note: 'Cleaning supplies & towels' },

  // ── May 2026 ──────────────────────────────────────────────────────────────
  { id: 'exp-b01', category: 'Rent',        amount: 1_500_000, date: '2026-05-01', note: 'Monthly gym rent — Kamayut' },
  { id: 'exp-b02', category: 'Salaries',    amount:   800_000, date: '2026-05-01', note: 'Ma Thida — trainer salary' },
  { id: 'exp-b03', category: 'Salaries',    amount:   700_000, date: '2026-05-01', note: 'Ko Naing — trainer salary' },
  { id: 'exp-b04', category: 'Salaries',    amount:   650_000, date: '2026-05-01', note: 'Daw Yin Yin — trainer salary' },
  { id: 'exp-b05', category: 'Salaries',    amount:   750_000, date: '2026-05-01', note: 'Ko Pyae Phyo — trainer salary' },
  { id: 'exp-b06', category: 'Utilities',   amount:   480_000, date: '2026-05-05', note: 'Electricity — YESC bill' },
  { id: 'exp-b07', category: 'Utilities',   amount:   150_000, date: '2026-05-08', note: 'Internet + water bill' },
  { id: 'exp-b08', category: 'Maintenance', amount:   150_000, date: '2026-05-12', note: 'Floor mat replacement' },
  { id: 'exp-b09', category: 'Other',       amount:   120_000, date: '2026-05-18', note: 'Office supplies & stationery' },
];

// ─── Seed Check-Ins (recent, for demo) ────────────────────────────────────────

export const seedCheckIns: CheckIn[] = [
  { id: 'ci-seed-01', memberId: 'mem-09', memberName: 'Ko Thura',    memberNameMM: 'ကိုသူရ',      timestamp: `${REF}T06:30:00.000Z` },
  { id: 'ci-seed-02', memberId: 'mem-10', memberName: 'Ma Hnin',     memberNameMM: 'မမ့နှင်း',    timestamp: `${REF}T07:15:00.000Z` },
  { id: 'ci-seed-03', memberId: 'mem-11', memberName: 'Win Ko Ko',   memberNameMM: 'ဝင်းကိုကို',  timestamp: `${REF}T08:00:00.000Z` },
  { id: 'ci-seed-04', memberId: 'mem-15', memberName: 'Kyaw Thu',    memberNameMM: 'ကျော်သူ',     timestamp: '2026-05-27T18:30:00.000Z' },
  { id: 'ci-seed-05', memberId: 'mem-20', memberName: 'Sandar Aung', memberNameMM: 'စန်းဒါးအောင်', timestamp: '2026-05-27T07:00:00.000Z' },
];
