'use client';

import { useRef, useState } from 'react';
import { UploadCloud, Loader2, X } from 'lucide-react';

export default function ImageUploader({ value, onChange, label = 'Image' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Upload failed.');
        setUploading(false);
        return;
      }
      onChange(data.url);
    } catch {
      setError('Network error during upload.');
    }
    setUploading(false);
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/50">{label}</label>

      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Uploaded preview" className="h-32 w-32 rounded-lg border border-gray-200 object-contain bg-white p-1" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-32 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-300 text-ink/40 transition hover:border-primary hover:text-primary"
        >
          {uploading ? <Loader2 size={22} className="animate-spin" /> : <UploadCloud size={22} />}
          <span className="text-xs font-semibold">{uploading ? 'Uploading…' : 'Upload'}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}
