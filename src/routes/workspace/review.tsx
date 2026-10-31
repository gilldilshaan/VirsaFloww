import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { useAuth } from '@/lib/auth/auth-context';
import { ClipboardCheck, CheckCircle2, AlertTriangle, XCircle, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkspaceReviewQueueScreen() {
  const { reviewQueue, submitReviewAction, requestCorrection } = useTerraLedger();
  const { user } = useAuth();

  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const handleAction = async (itemId: string, evidenceId: string, action: 'approve' | 'flag') => {
    const res = await submitReviewAction({
      reviewQueueItemId: itemId,
      evidenceId,
      action,
      reviewer: user?.name || 'Mankirat Singh (Lead Auditor)',
      comments: commentText || `Action ${action} recorded by verifier.`,
    });
    if (res.success) {
      setActionSuccessMsg(res.message);
      setCommentText('');
      setTimeout(() => setActionSuccessMsg(''), 2500);
    }
  };

  const handleCorrection = async (itemId: string) => {
    const res = await requestCorrection({
      reviewQueueItemId: itemId,
      requirement: commentText || 'Re-capture in-boundary photograph with GPS accuracy < 5m.',
      reviewer: user?.name || 'Mankirat Singh (Lead Auditor)',
    });
    if (res.success) {
      setActionSuccessMsg(res.message);
      setCommentText('');
      setTimeout(() => setActionSuccessMsg(''), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="MRV Review Queue"
        description="Auditor inbox for pending field evidence submissions, automated rule evaluations, and non-destructive correction requests."
      />

      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3.5 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        {reviewQueue.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#edf0e7]">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#245b45]">{item.id}</span>
                <span className="text-[#72816f]">· Target: <strong className="text-[#193b2a]">{item.fieldCode}</strong></span>
                <span className="font-mono text-[10px] text-[#72816f]">({item.evidenceId})</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                    item.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.status.toUpperCase()}
                </span>
                <span className="text-[10px] text-[#72816f]">{item.submittedAt}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <h3 className="font-serif text-base font-semibold text-[#193b2a]">{item.evidenceTitle}</h3>
                <p className="text-[#526451]">{item.reviewNotes || 'Pending initial auditor review.'}</p>

                {/* Automated Rule Results */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {item.rules.map((rule) => (
                    <span
                      key={rule.ruleId}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                        rule.status === 'pass'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : rule.status === 'warn'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}
                      title={rule.message}
                    >
                      {rule.status === 'pass' ? (
                        <CheckCircle2 size={11} className="text-emerald-600" />
                      ) : rule.status === 'warn' ? (
                        <AlertTriangle size={11} className="text-amber-600" />
                      ) : (
                        <XCircle size={11} className="text-red-600" />
                      )}
                      <span>{rule.ruleName}: {rule.status.toUpperCase()}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Auditor Action Box */}
              {item.status !== 'resolved' && (
                <div className="w-full sm:w-80 bg-[#f9faf7] border border-[#dfe6d9] rounded-lg p-3 space-y-2">
                  <label className="text-[10px] font-mono text-[#72816f] block uppercase">
                    Auditor Notes / Correction Requirement
                  </label>
                  <textarea
                    rows={2}
                    value={activeItem === item.id ? commentText : ''}
                    onFocus={() => setActiveItem(item.id)}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter audit remarks or correction request details..."
                    className="w-full text-xs bg-white border border-[#dce3d7] rounded p-2 outline-none focus:border-[#245b45]"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(item.id, item.evidenceId, 'flag')}
                      className="text-xs h-7 border-amber-300 text-amber-900 hover:bg-amber-100"
                    >
                      Flag
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCorrection(item.id)}
                      className="text-xs h-7 border-sky-300 text-sky-900 hover:bg-sky-100"
                    >
                      Request Correction
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAction(item.id, item.evidenceId, 'approve')}
                      className="text-xs h-7 bg-[#245b45] text-white hover:bg-[#1a4333]"
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/review')({
  component: WorkspaceReviewQueueScreen,
});
