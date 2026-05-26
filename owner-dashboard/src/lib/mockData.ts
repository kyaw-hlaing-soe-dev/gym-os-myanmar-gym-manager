// ─── Mock Data for GymOS Myanmar – Manager Dashboard ───────────────────────────

export interface ChurnMember {
  id: string;
  name: string;
  nameMM: string;
  avatar: string;
  plan: string;
  churnScore: number;
  lastCheckin: string;
  daysInactive: number;
  paymentStatus: 'paid' | 'overdue' | 'unpaid';
  phone: string;
  joinedDaysAgo: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  target: number;
  members: number;
}

export interface TrainerStat {
  id: string;
  name: string;
  avatar: string;
  clients: number;
  sessionsThisMonth: number;
  retentionRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CheckinHeatmapData {
  day: string;
  hour: string;
  count: number;
}

export interface Notification {
  id: string;
  type: 'churn' | 'payment' | 'checkin' | 'system';
  message: string;
  time: string;
  read: boolean;
}

export interface MemberActivity {
  date: string;
  checkins: number;
}

// ─── Gym Metadata ─────────────────────────────────────────────────────────────
export const gymMeta = {
  name: 'FitZone Yangon',
  nameMM: 'ဖစ်ဇုန် ရန်ကုန်',
  branch: 'Kamayut Branch',
  owner: 'Ko Aung',
  subscriptionPlan: 'Pro',
  totalMembers: 184,
  activeMembers: 162,
  monthlyRevenue: 18_400_000,
  revenueChange: +12.4,
  avgAttendanceRate: 68,
  attendanceChange: -3.2,
  churnRiskCount: 8,
  newMembersThisMonth: 14,
};

// ─── KPI Cards ────────────────────────────────────────────────────────────────
export const kpiCards = [
  {
    id: 'revenue',
    label: 'Monthly Revenue',
    labelMM: 'လစဉ်ဝင်ငွေ',
    value: '18.4M MMK',
    rawValue: 18_400_000,
    change: +12.4,
    icon: 'TrendingUp',
    color: 'teal',
  },
  {
    id: 'members',
    label: 'Active Members',
    labelMM: 'တက်ကြွသောအဖွဲ့ဝင်များ',
    value: '162',
    rawValue: 162,
    change: +8,
    icon: 'Users',
    color: 'navy',
  },
  {
    id: 'churn',
    label: 'Churn Risk',
    labelMM: 'ထွက်ခွာနိုင်ခြေ',
    value: '8 Members',
    rawValue: 8,
    change: -2,
    icon: 'AlertTriangle',
    color: 'amber',
  },
  {
    id: 'attendance',
    label: 'Avg Attendance',
    labelMM: 'ပျမ်းမျှတက်ရောက်မှု',
    value: '68%',
    rawValue: 68,
    change: -3.2,
    icon: 'Activity',
    color: 'slate',
  },
];

// ─── Revenue Chart ────────────────────────────────────────────────────────────
export const revenueData: RevenueDataPoint[] = [
  { month: 'Dec', revenue: 14_200_000, target: 15_000_000, members: 148 },
  { month: 'Jan', revenue: 15_100_000, target: 15_000_000, members: 155 },
  { month: 'Feb', revenue: 13_800_000, target: 16_000_000, members: 151 },
  { month: 'Mar', revenue: 16_400_000, target: 16_000_000, members: 158 },
  { month: 'Apr', revenue: 16_800_000, target: 17_000_000, members: 162 },
  { month: 'May', revenue: 18_400_000, target: 17_000_000, members: 162 },
];

// ─── Churn Risk Members ───────────────────────────────────────────────────────
export const churnMembers: ChurnMember[] = [
  {
    id: 'm1',
    name: 'Zaw Myint',
    nameMM: 'ဇော်မြင့်',
    avatar: 'ZM',
    plan: 'Premium',
    churnScore: 87,
    lastCheckin: '23 days ago',
    daysInactive: 23,
    paymentStatus: 'overdue',
    phone: '+95 9 7654 3210',
    joinedDaysAgo: 45,
  },
  {
    id: 'm2',
    name: 'Thin Thin Aye',
    nameMM: 'သင်းသင်းအေး',
    avatar: 'TA',
    plan: 'Basic',
    churnScore: 82,
    lastCheckin: '18 days ago',
    daysInactive: 18,
    paymentStatus: 'unpaid',
    phone: '+95 9 8765 4321',
    joinedDaysAgo: 28,
  },
  {
    id: 'm3',
    name: 'Kyaw Zin Htun',
    nameMM: 'ကျော်ဇင်ထွန်း',
    avatar: 'KH',
    plan: 'Premium',
    churnScore: 78,
    lastCheckin: '15 days ago',
    daysInactive: 15,
    paymentStatus: 'paid',
    phone: '+95 9 9876 5432',
    joinedDaysAgo: 52,
  },
  {
    id: 'm4',
    name: 'Su Su Lwin',
    nameMM: 'စုစုလွင်',
    avatar: 'SL',
    plan: 'Basic',
    churnScore: 74,
    lastCheckin: '21 days ago',
    daysInactive: 21,
    paymentStatus: 'overdue',
    phone: '+95 9 6543 2109',
    joinedDaysAgo: 35,
  },
  {
    id: 'm5',
    name: 'Aung Ko Ko',
    nameMM: 'အောင်ကိုကို',
    avatar: 'AK',
    plan: 'Premium Plus',
    churnScore: 71,
    lastCheckin: '12 days ago',
    daysInactive: 12,
    paymentStatus: 'paid',
    phone: '+95 9 5432 1098',
    joinedDaysAgo: 60,
  },
  {
    id: 'm6',
    name: 'Ei Ei Mon',
    nameMM: 'အေးအေးမွန်',
    avatar: 'EM',
    plan: 'Basic',
    churnScore: 70,
    lastCheckin: '19 days ago',
    daysInactive: 19,
    paymentStatus: 'unpaid',
    phone: '+95 9 4321 0987',
    joinedDaysAgo: 22,
  },
];

// ─── Trainer Performance ──────────────────────────────────────────────────────
export const trainerStats: TrainerStat[] = [
  {
    id: 't1',
    name: 'Ma Thida',
    avatar: 'MT',
    clients: 24,
    sessionsThisMonth: 48,
    retentionRate: 94,
    trend: 'up',
  },
  {
    id: 't2',
    name: 'Ko Naing',
    avatar: 'KN',
    clients: 18,
    sessionsThisMonth: 36,
    retentionRate: 88,
    trend: 'stable',
  },
  {
    id: 't3',
    name: 'Daw Yin Yin',
    avatar: 'YY',
    clients: 15,
    sessionsThisMonth: 30,
    retentionRate: 80,
    trend: 'down',
  },
  {
    id: 't4',
    name: 'Ko Pyae Phyo',
    avatar: 'PP',
    clients: 21,
    sessionsThisMonth: 42,
    retentionRate: 91,
    trend: 'up',
  },
];

// ─── Occupancy Heatmap ────────────────────────────────────────────────────────
export const heatmapData = [
  // Format: [dayIndex (0=Mon), hour, count]
  // Monday
  { day: 'Mon', hour: '6AM', count: 12 }, { day: 'Mon', hour: '8AM', count: 28 },
  { day: 'Mon', hour: '10AM', count: 18 }, { day: 'Mon', hour: '12PM', count: 22 },
  { day: 'Mon', hour: '2PM', count: 10 }, { day: 'Mon', hour: '4PM', count: 30 },
  { day: 'Mon', hour: '6PM', count: 45 }, { day: 'Mon', hour: '8PM', count: 35 },
  // Tuesday
  { day: 'Tue', hour: '6AM', count: 15 }, { day: 'Tue', hour: '8AM', count: 32 },
  { day: 'Tue', hour: '10AM', count: 20 }, { day: 'Tue', hour: '12PM', count: 25 },
  { day: 'Tue', hour: '2PM', count: 12 }, { day: 'Tue', hour: '4PM', count: 38 },
  { day: 'Tue', hour: '6PM', count: 52 }, { day: 'Tue', hour: '8PM', count: 40 },
  // Wednesday
  { day: 'Wed', hour: '6AM', count: 10 }, { day: 'Wed', hour: '8AM', count: 25 },
  { day: 'Wed', hour: '10AM', count: 15 }, { day: 'Wed', hour: '12PM', count: 18 },
  { day: 'Wed', hour: '2PM', count: 8 }, { day: 'Wed', hour: '4PM', count: 28 },
  { day: 'Wed', hour: '6PM', count: 42 }, { day: 'Wed', hour: '8PM', count: 32 },
  // Thursday
  { day: 'Thu', hour: '6AM', count: 14 }, { day: 'Thu', hour: '8AM', count: 30 },
  { day: 'Thu', hour: '10AM', count: 22 }, { day: 'Thu', hour: '12PM', count: 20 },
  { day: 'Thu', hour: '2PM', count: 11 }, { day: 'Thu', hour: '4PM', count: 35 },
  { day: 'Thu', hour: '6PM', count: 48 }, { day: 'Thu', hour: '8PM', count: 38 },
  // Friday
  { day: 'Fri', hour: '6AM', count: 18 }, { day: 'Fri', hour: '8AM', count: 35 },
  { day: 'Fri', hour: '10AM', count: 24 }, { day: 'Fri', hour: '12PM', count: 28 },
  { day: 'Fri', hour: '2PM', count: 15 }, { day: 'Fri', hour: '4PM', count: 40 },
  { day: 'Fri', hour: '6PM', count: 58 }, { day: 'Fri', hour: '8PM', count: 45 },
  // Saturday
  { day: 'Sat', hour: '6AM', count: 22 }, { day: 'Sat', hour: '8AM', count: 42 },
  { day: 'Sat', hour: '10AM', count: 38 }, { day: 'Sat', hour: '12PM', count: 35 },
  { day: 'Sat', hour: '2PM', count: 20 }, { day: 'Sat', hour: '4PM', count: 45 },
  { day: 'Sat', hour: '6PM', count: 60 }, { day: 'Sat', hour: '8PM', count: 50 },
  // Sunday
  { day: 'Sun', hour: '6AM', count: 8 }, { day: 'Sun', hour: '8AM', count: 18 },
  { day: 'Sun', hour: '10AM', count: 28 }, { day: 'Sun', hour: '12PM', count: 30 },
  { day: 'Sun', hour: '2PM', count: 18 }, { day: 'Sun', hour: '4PM', count: 25 },
  { day: 'Sun', hour: '6PM', count: 35 }, { day: 'Sun', hour: '8PM', count: 28 },
];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HOURS = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'];

// ─── Recent Activity ──────────────────────────────────────────────────────────
export const recentActivity: MemberActivity[] = [
  { date: 'May 20', checkins: 48 },
  { date: 'May 21', checkins: 62 },
  { date: 'May 22', checkins: 55 },
  { date: 'May 23', checkins: 71 },
  { date: 'May 24', checkins: 38 },
  { date: 'May 25', checkins: 65 },
  { date: 'May 26', checkins: 42 },
];

// ─── Notifications ─────────────────────────────────────────────────────────────
export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'churn',
    message: 'Zaw Myint churn score reached 87 — HIGH RISK',
    time: '2 hrs ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'payment',
    message: 'Payment overdue: Su Su Lwin (3 days)',
    time: '4 hrs ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'checkin',
    message: '62 check-ins today — 14% above average',
    time: '6 hrs ago',
    read: true,
  },
  {
    id: 'n4',
    type: 'system',
    message: 'AI churn analysis completed for May 2025',
    time: '8 hrs ago',
    read: true,
  },
];

// ─── Utility Cost Tracking (Pain Point: Power Outages) ────────────────────────
export interface UtilityCost {
  month: string;
  gridCost: number;
  generatorCost: number;
  outageHours: number;
  dieselLiters: number;
}

export const utilityCosts: UtilityCost[] = [
  { month: 'Jan', gridCost: 420_000, generatorCost: 380_000, outageHours: 18, dieselLiters: 95 },
  { month: 'Feb', gridCost: 450_000, generatorCost: 320_000, outageHours: 14, dieselLiters: 80 },
  { month: 'Mar', gridCost: 480_000, generatorCost: 520_000, outageHours: 26, dieselLiters: 130 },
  { month: 'Apr', gridCost: 510_000, generatorCost: 450_000, outageHours: 22, dieselLiters: 112 },
  { month: 'May', gridCost: 490_000, generatorCost: 280_000, outageHours: 12, dieselLiters: 70 },
];

export const utilityInsights = {
  avgMonthlyCost: 4_300_000,
  generatorPercentage: 42,
  peakOutageDay: 'Wednesday',
  peakOutageTime: '2PM–5PM',
  aiRecommendation: 'Shift evening Zumba class (Wed 5PM) to Thu 6PM to avoid peak generator usage. Estimated saving: 45,000 MMK/month.',
  aiRecommendationMM: 'ဗုဒ္ဓဟူးနေ့ ညနေ ၅နာရီ Zumba အတန်းကို ကြာသပတေးနေ့ ညနေ ၆နာရီသို့ ပြောင်းပါ။ ခန့်မှန်းခြေ ချွေတာနိုင်သောပမာဏ - ၄၅,၀၀၀ ကျပ်/လ',
  budgetThisMonth: 850_000,
  spentThisMonth: 770_000,
};

// ─── Equipment Manager (Pain Point: Equipment Sourcing) ───────────────────────
export interface Equipment {
  id: string;
  name: string;
  nameMM: string;
  category: 'cardio' | 'strength' | 'functional' | 'accessories';
  status: 'good' | 'needs-service' | 'out-of-order';
  usageHours: number;
  maxHours: number;
  lastMaintenance: string;
  nextMaintenance: string;
  purchaseDate: string;
  costMMK: number;
  aiNote: string;
}

export const equipmentList: Equipment[] = [
  {
    id: 'eq1', name: 'Treadmill A1', nameMM: 'ပြေးစက် A1', category: 'cardio',
    status: 'good', usageHours: 2400, maxHours: 5000, lastMaintenance: 'Apr 15',
    nextMaintenance: 'Jul 15', purchaseDate: 'Jan 2024', costMMK: 3_500_000,
    aiNote: 'Belt replacement recommended at 3,000 hours. Estimated cost: 180,000 MMK.',
  },
  {
    id: 'eq2', name: 'Bench Press Station', nameMM: 'ရင်ဘတ်နှိပ်စက်', category: 'strength',
    status: 'good', usageHours: 1800, maxHours: 8000, lastMaintenance: 'May 1',
    nextMaintenance: 'Aug 1', purchaseDate: 'Mar 2023', costMMK: 2_200_000,
    aiNote: 'Excellent condition. No action needed.',
  },
  {
    id: 'eq3', name: 'Elliptical B2', nameMM: 'ဘဲဥပုံစက် B2', category: 'cardio',
    status: 'needs-service', usageHours: 4200, maxHours: 5000, lastMaintenance: 'Feb 10',
    nextMaintenance: 'OVERDUE', purchaseDate: 'Jun 2022', costMMK: 4_100_000,
    aiNote: 'At 84% life. Repair cost estimate: 450,000 MMK. Replacement: 4,500,000 MMK. Recommend repair — 2 more years of use.',
  },
  {
    id: 'eq4', name: 'Cable Machine', nameMM: 'ကြိုးစက်', category: 'strength',
    status: 'good', usageHours: 3100, maxHours: 10000, lastMaintenance: 'May 20',
    nextMaintenance: 'Aug 20', purchaseDate: 'Sep 2023', costMMK: 5_800_000,
    aiNote: 'Cable tension adjustment due at 3,500 hours.',
  },
  {
    id: 'eq5', name: 'Spin Bike C3', nameMM: 'စက်ဘီးစက် C3', category: 'cardio',
    status: 'out-of-order', usageHours: 4800, maxHours: 5000, lastMaintenance: 'Jan 5',
    nextMaintenance: 'N/A', purchaseDate: 'Aug 2021', costMMK: 1_800_000,
    aiNote: 'Flywheel bearing failed. Repair cost: 320,000 MMK. At 96% life — recommend replace. ROI: new bike pays for itself in 8 months.',
  },
  {
    id: 'eq6', name: 'Rowing Machine', nameMM: 'လှေခတ်စက်', category: 'cardio',
    status: 'good', usageHours: 1200, maxHours: 6000, lastMaintenance: 'May 10',
    nextMaintenance: 'Aug 10', purchaseDate: 'Nov 2024', costMMK: 2_900_000,
    aiNote: 'New machine. Operating normally.',
  },
  {
    id: 'eq7', name: 'Kettlebell Set (8-24kg)', nameMM: 'ကတ်တယ်ဘဲလ်', category: 'functional',
    status: 'needs-service', usageHours: 0, maxHours: 0, lastMaintenance: 'N/A',
    nextMaintenance: 'Jun 1', purchaseDate: 'Feb 2023', costMMK: 650_000,
    aiNote: 'Rubber coating peeling on 16kg and 20kg. Replace coating or buy new set (380,000 MMK).',
  },
];

// ─── Payment Reconciliation (Pain Point: Payment Chaos) ───────────────────────
export interface PaymentChannel {
  channel: string;
  amount: number;
  percentage: number;
  color: string;
  transactions: number;
}

export const paymentChannels: PaymentChannel[] = [
  { channel: 'KBZPay', amount: 7_200_000, percentage: 39, color: '#0066cc', transactions: 68 },
  { channel: 'Cash', amount: 4_600_000, percentage: 25, color: '#16a34a', transactions: 45 },
  { channel: 'WavePay', amount: 3_300_000, percentage: 18, color: '#e11d48', transactions: 32 },
  { channel: 'Bank Transfer', amount: 2_400_000, percentage: 13, color: '#8b5cf6', transactions: 18 },
  { channel: 'CB Pay', amount: 900_000, percentage: 5, color: '#f59e0b', transactions: 9 },
];

export interface OverduePayment {
  id: string;
  memberName: string;
  memberNameMM: string;
  avatar: string;
  plan: string;
  amountDue: number;
  daysOverdue: number;
  lastPaymentMethod: string;
  phone: string;
}

export const overduePayments: OverduePayment[] = [
  { id: 'op1', memberName: 'Zaw Myint', memberNameMM: 'ဇော်မြင့်', avatar: 'ZM', plan: 'Premium', amountDue: 150_000, daysOverdue: 12, lastPaymentMethod: 'KBZPay', phone: '+95 9 7654 3210' },
  { id: 'op2', memberName: 'Su Su Lwin', memberNameMM: 'စုစုလွင်', avatar: 'SL', plan: 'Basic', amountDue: 80_000, daysOverdue: 8, lastPaymentMethod: 'Cash', phone: '+95 9 6543 2109' },
  { id: 'op3', memberName: 'Ei Ei Mon', memberNameMM: 'အေးအေးမွန်', avatar: 'EM', plan: 'Basic', amountDue: 80_000, daysOverdue: 5, lastPaymentMethod: 'WavePay', phone: '+95 9 4321 0987' },
  { id: 'op4', memberName: 'Hla Myat', memberNameMM: 'လှမြတ်', avatar: 'HM', plan: 'Premium', amountDue: 150_000, daysOverdue: 3, lastPaymentMethod: 'KBZPay', phone: '+95 9 3210 9876' },
];

export const paymentSummary = {
  expectedRevenue: 19_200_000,
  actualCollected: 18_400_000,
  collectionRate: 95.8,
  overdueTotal: 460_000,
  leakyMemberships: 3,
  trainerCommissions: 2_760_000,
};

// ─── Social Media Hub (Pain Point: Social Media Over-Reliance) ────────────────
export interface SocialPost {
  id: string;
  platform: 'facebook' | 'viber';
  type: 'promo' | 'motivation' | 'schedule' | 'transformation';
  contentEN: string;
  contentMM: string;
  scheduledDate: string;
  status: 'draft' | 'scheduled' | 'sent';
}

export const socialMediaPosts: SocialPost[] = [
  {
    id: 'sp1', platform: 'facebook', type: 'promo', status: 'scheduled',
    contentEN: '🔥 Summer Special! Join FitZone Yangon this June — first month FREE for new members. DM us now!',
    contentMM: '🔥 နွေရာသီ အထူးလျှော့ဈေး! ဇွန်လတွင် FitZone ရန်ကုန်သို့ ဝင်ရောက်ပါ — အသစ်အဖွဲ့ဝင်များ ပထမလ အခမဲ့။ ယခုပဲ DM ပို့ပါ!',
    scheduledDate: 'May 28, 10AM',
  },
  {
    id: 'sp2', platform: 'viber', type: 'motivation', status: 'draft',
    contentEN: '💪 "The only bad workout is the one that didn\'t happen." See you at the gym today!',
    contentMM: '💪 "မလုပ်ခဲ့တဲ့ လေ့ကျင့်ခန်းပဲ ဆိုးတဲ့ လေ့ကျင့်ခန်း ဖြစ်ပါတယ်။" ဒီနေ့ ဂျင်မှာ တွေ့မယ်!',
    scheduledDate: 'May 27, 8AM',
  },
  {
    id: 'sp3', platform: 'facebook', type: 'schedule', status: 'scheduled',
    contentEN: '📋 This week at FitZone:\nMon/Wed/Fri — Yoga 6AM\nTue/Thu — HIIT 5PM\nSat — Zumba 9AM\nSun — Open Gym',
    contentMM: '📋 ဤအပတ် FitZone:\nတနင်္လာ/ဗုဒ္ဓဟူး/သောကြာ — ယောဂ ၆နာရီ\nအင်္ဂါ/ကြာသပတေး — HIIT ညနေ ၅နာရီ\nစနေ — Zumba မနက် ၉နာရီ\nတနင်္ဂနွေ — အားကစားခန်းမ ဖွင့်',
    scheduledDate: 'May 26, 7AM',
  },
  {
    id: 'sp4', platform: 'facebook', type: 'transformation', status: 'draft',
    contentEN: '🏆 Member Spotlight: Ko Thura lost 12kg in 3 months with trainer Ma Thida! Your transformation starts here.',
    contentMM: '🏆 အဖွဲ့ဝင် သတင်း: ကိုသူရ သည် ဆရာမ မသိဒါ နှင့်အတူ ၃လအတွင်း ၁၂ကီလို ကျဆင်းခဲ့ပါသည်! သင့်ပြောင်းလဲမှု ဒီကနေ စတင်ပါ။',
    scheduledDate: 'May 30, 12PM',
  },
];

export interface ViberMessage {
  id: string;
  type: 'payment_reminder' | 'birthday' | 'class_schedule' | 'reengagement';
  recipientCount: number;
  sentDate: string;
  openRate: number;
  templateEN: string;
  templateMM: string;
}

export const viberMessageLog: ViberMessage[] = [
  {
    id: 'vm1', type: 'payment_reminder', recipientCount: 12, sentDate: 'May 25',
    openRate: 83,
    templateEN: 'Hi {name}, your membership expires in 3 days. Renew via KBZPay to keep your streak! 💪',
    templateMM: 'မင်္ဂလာပါ {name}၊ သင့်အဖွဲ့ဝင်မှု ၃ ရက်အတွင်း ကုန်ဆုံးပါမည်။ KBZPay ဖြင့် သက်တမ်းတိုးပါ! 💪',
  },
  {
    id: 'vm2', type: 'birthday', recipientCount: 3, sentDate: 'May 24',
    openRate: 100,
    templateEN: '🎂 Happy Birthday {name}! Enjoy a FREE personal training session this week as our gift to you!',
    templateMM: '🎂 မွေးနေ့ မင်္ဂလာပါ {name}! ဤအပတ် အခမဲ့ ကိုယ်ပိုင် လေ့ကျင့်ရေး session ကို ခံစားပါ!',
  },
  {
    id: 'vm3', type: 'class_schedule', recipientCount: 84, sentDate: 'May 23',
    openRate: 67,
    templateEN: '📋 Weekly schedule updated! New Zumba class added on Saturday 9AM. Book your spot now.',
    templateMM: '📋 အပတ်စဉ် အစီအစဉ် အပ်ဒိတ်! စနေနေ့ မနက် ၉နာရီ Zumba အတန်း အသစ် ထပ်ထည့်ပါပြီ။ သင့်နေရာ ယခု ကြိုတင်မှာပါ။',
  },
  {
    id: 'vm4', type: 'reengagement', recipientCount: 8, sentDate: 'May 22',
    openRate: 62,
    templateEN: 'We miss you {name}! It\'s been {days} days. Come back for a free group class this weekend! 🏋️',
    templateMM: 'သင့်ကို လွမ်းနေပါတယ် {name}! {days} ရက် ဖြစ်သွားပါပြီ။ ဤအပတ်ကုန် အခမဲ့ အုပ်စု အတန်းအတွက် ပြန်လာပါ! 🏋️',
  },
];

export const socialStats = {
  totalMessagesSentThisMonth: 142,
  avgOpenRate: 74,
  autoRepliesHandled: 38,
  contentSuggestionsGenerated: 12,
  viberGroupMembers: 156,
  facebookFollowers: 2_840,
};
