'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { deleteLink } from './actions';

export function DeleteLinkDialog({ id }: { id: number }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (loading) return;
    setIsOpen(false);
    setError(null);
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    const result = await deleteLink({ id });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Unable to delete link.');
      return;
    }

    handleClose();
    router.refresh();
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div
            className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm delete link"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                  Delete link
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Are you sure you want to permanently delete this short link? This action cannot be undone.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                ✕
              </Button>
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default DeleteLinkDialog;
