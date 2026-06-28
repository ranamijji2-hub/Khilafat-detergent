'use client';

import { useEffect, useRef, useState } from 'react';
import { UploadCloud, Trash2, Copy, Check, Loader2 } from 'lucide-react';

export default function AdminMediaPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const inputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/upload');
    const data = await res.json();
    setFiles(data.files || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    for (const file of fileList) {
      const formData = new FormData();
      formData.append('file', file);
      await fetch('/api/upload', { method: 'POST', body: formData });
    }
    setUploading(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image? It may still be referenced by products or banners.')) return;
    await fetch(`/api/upload/${id}`, { method: 'DELETE' });
    load();
  };

  const copyUrl = (file) => {
    navigator.clipboard.writeText(window.location.origin + file.url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">Media Library</h1>
          <p className="mt-1 text-sm text-ink/55">All images uploaded through the admin panel.</p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold disabled:opacity-60"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          {uploading ? 'Uploading…' : 'Upload Images'}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-ink/50">Loading…</p>
      ) : files.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink/40">No images uploaded yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {files.map((f) => (
            <div key={f.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card">
              <img src={f.url} alt={f.filename} className="h-28 w-full bg-primary/5 object-contain p-2" />
              <div className="flex items-center justify-between gap-1 border-t border-gray-100 p-2">
                <button onClick={() => copyUrl(f)} className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-bold text-ink/60" title="Copy URL">
                  {copiedId === f.id ? <Check size={12} /> : <Copy size={12} />} {copiedId === f.id ? 'Copied' : 'Copy'}
                </button>
                <button onClick={() => handleDelete(f.id)} className="rounded-full bg-red-50 p-1.5 text-red-500" title="Delete">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
