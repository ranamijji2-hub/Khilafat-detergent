export const metadata = { title: 'Admin Login', robots: { index: false, follow: false } };

export default function AdminAuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center water-bg px-4">
      {children}
    </div>
  );
}
