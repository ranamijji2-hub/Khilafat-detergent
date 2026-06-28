'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      {/* desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
          <span className="font-heading text-sm font-extrabold text-primary">Khilafat Admin</span>
          <button onClick={() => setOpen((v) => !v)} className="rounded-md p-1.5 text-primary" aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
