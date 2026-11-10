export const metadata = {
  title: 'INVEXA Portal — Workspace & Dealflow',
  description: 'Manage venture pitch requests, calendar meetings, and fundraising pipeline.',
};

export default function AuthenticatedDashboardLayout({ children }) {
  // Next.js App Router Nested Layout
  return (
    <div className="min-h-screen bg-surface">
      {children}
    </div>
  );
}

