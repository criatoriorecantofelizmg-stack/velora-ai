import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, MessageSquare, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeedbackModal: React.FC = () => {
  const { feedbackJob, setFeedbackJob, submitFeedback } = useApp();

  const [rating, setRating] = useState<'like' | 'dislike'>('dislike');
  const [reason, setReason] = useState<any>('Not realistic');
  const [comment, setComment] = useState('');

  if (!feedbackJob) return null;

  const reasonsList = [
    'Not realistic',
    'Changed reference',
    'Bad motion',
    'Bad anatomy',
    'Flicker',
    'Poor quality',
    'Wrong camera',
    'Other',
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({
      jobId: feedbackJob.id,
      rating,
      reason: rating === 'dislike' ? reason : undefined,
      comment,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141e] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Generation Feedback</h3>
          </div>
          <button
            onClick={() => setFeedbackJob(null)}
            className="p-1 rounded text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Like / Dislike Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRating('like')}
              className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                rating === 'like'
                  ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-white'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              Looks Great
            </button>
            <button
              type="button"
              onClick={() => setRating('dislike')}
              className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                rating === 'dislike'
                  ? 'bg-rose-600/20 border-rose-500/50 text-rose-300'
                  : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-white'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              Needs Improvement
            </button>
          </div>

          {rating === 'dislike' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">What went wrong?</label>
              <div className="grid grid-cols-2 gap-1.5">
                {reasonsList.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={`px-3 py-2 rounded-lg text-xs text-left border transition-all ${
                      reason === r
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 font-medium'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe specifically what artifact or behavior occurred..."
              rows={3}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setFeedbackJob(null)}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/40"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
