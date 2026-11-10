import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "$0";
  const num = Number(amount);
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}K`;
  }
  return `$${num.toLocaleString()}`;
}

export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr;
}

export function calculateProfileCompletion(profile, role = 'startup') {
  if (!profile) return 0;
  
  if (role === 'startup') {
    const fields = [
      'companyName',
      'tagline',
      'description',
      'industry',
      'stage',
      'location',
      'foundingYear',
      'fundingRequired',
      'pitchDeckUrl',
      'website',
    ];
    let filled = 0;
    fields.forEach((field) => {
      if (profile[field] && String(profile[field]).trim().length > 0) {
        filled++;
      }
    });
    return Math.round((filled / fields.length) * 100);
  } else {
    const fields = [
      'firmName',
      'title',
      'bio',
      'industries',
      'minInvestment',
      'maxInvestment',
      'preferredStages',
      'location',
      'linkedinUrl',
    ];
    let filled = 0;
    fields.forEach((field) => {
      const val = profile[field];
      if (Array.isArray(val) ? val.length > 0 : val && String(val).trim().length > 0) {
        filled++;
      }
    });
    return Math.round((filled / fields.length) * 100);
  }
}

export const STATUS_COLORS = {
  Pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  Accepted: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Rejected: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  Cancelled: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
  },
  Completed: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
};

