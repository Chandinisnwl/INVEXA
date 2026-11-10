'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatDate } from '@/lib/utils';
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function StartupPitchDeckPage() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deckTitle, setDeckTitle] = useState('Series Seed Investor Presentation');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchDecks = async () => {
    try {
      const res = await fetch('/api/pitch-deck');
      if (res.ok) {
        const data = await res.json();
        setDecks(data.decks || []);
        if (data.decks && data.decks.length > 0) {
          setPreviewUrl(data.decks[0].fileUrl);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'Only PDF documents are supported.' });
        setSelectedFile(null);
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File exceeds maximum limit of 20MB.' });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', deckTitle);

      const res = await fetch('/api/pitch-deck/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload pitch deck');

      setMessage({ type: 'success', text: 'Pitch deck successfully uploaded and validated!' });
      setSelectedFile(null);
      await fetchDecks();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (deckId) => {
    if (!confirm('Are you sure you want to delete this pitch deck?')) return;
    try {
      const res = await fetch(`/api/pitch-deck?id=${deckId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Pitch deck deleted.' });
        setPreviewUrl(null);
        await fetchDecks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="startup" title="Pitch Deck Vault">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Info Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Pitch Deck Management</h2>
              <p className="text-xs text-slate-500">
                Upload your verified PDF deck. Verified investors will review it before booking meetings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Vault Storage</span>
          </div>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-xl flex items-center gap-2 text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* UPLOAD & METADATA SECTION */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">
                {decks.length > 0 ? 'Replace or Upload New Version' : 'Upload Your Pitch Deck'}
              </h3>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Deck Title
                  </label>
                  <input
                    type="text"
                    required
                    value={deckTitle}
                    onChange={(e) => setDeckTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>

                {/* Drag and Drop Box */}
                <div className="border-2 border-dashed border-slate-200 hover:border-accent rounded-2xl p-6 text-center transition-colors">
                  <UploadCloud className="w-10 h-10 text-accent/80 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">
                    {selectedFile ? selectedFile.name : 'Choose a PDF file to upload'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready`
                      : 'PDF documents up to 20MB supported'}
                  </p>
                  <label className="mt-3 inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors">
                    Browse File
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-accent hover:bg-accent-hover shadow-md shadow-accent/20 transition-all disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading & Processing PDF...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>{decks.length > 0 ? 'Upload & Replace Version' : 'Upload Deck'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Existing Uploaded Decks List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                Deck History & Versions
              </h3>

              {decks.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  No decks uploaded yet.
                </p>
              ) : (
                decks.map((d) => (
                  <div
                    key={d._id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-surface flex items-center justify-between"
                  >
                    <div className="overflow-hidden pr-2">
                      <p className="text-xs font-bold text-slate-800 truncate">{d.fileName}</p>
                      <p className="text-[10px] text-slate-500">
                        Uploaded {formatDate(d.createdAt)} • {(d.fileSize / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a
                        href={d.fileUrl}
                        download
                        className="p-1.5 text-slate-600 hover:text-accent rounded-lg hover:bg-slate-100"
                        title="Download deck"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                        title="Delete deck"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PREVIEW CONTAINER */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold text-primary">Pitch Deck Live Preview</h3>
                </div>
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    <span>Full Screen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {previewUrl ? (
                <div className="w-full h-[520px] rounded-xl border border-slate-200 overflow-hidden bg-slate-900 flex flex-col">
                  <iframe
                    src={previewUrl}
                    title="Pitch Deck Preview"
                    className="w-full h-full border-none"
                  />
                </div>
              ) : (
                <div className="h-[520px] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-2">
                  <FileText className="w-12 h-12 text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">No Pitch Deck Selected</p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Upload your pitch deck on the left panel to enable live embedded PDF preview.
                  </p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-4 text-center">
              Watermarked view for registered investors. Only authorized users can download the original copy.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

