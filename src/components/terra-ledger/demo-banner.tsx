import { useTerraLedger } from '@/lib/terra-ledger/store';
import { ArrowRight, RotateCcw, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DemoBanner() {
  const { demoState, setDemoState, advanceDemoState, resetDemoState, completenessPercent, assessmentStatus } =
    useTerraLedger();

  return (
    <div className="bg-slate-900 border-b border-emerald-900/40 text-slate-100 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Left: Indicator & Status */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase">
            <Sparkles size={12} className="text-emerald-400 animate-pulse" />
            VirsaFlow Demo
          </div>

          <span className="text-slate-400 hidden sm:inline">|</span>

          {/* Stepper pills */}
          <div className="inline-flex rounded-md p-0.5 bg-slate-800/90 border border-slate-700">
            <button
              onClick={() => setDemoState('unverified')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                demoState === 'unverified'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Unverified (Spatial Mismatch)
            </button>
            <button
              onClick={() => setDemoState('needs-review')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                demoState === 'needs-review'
                  ? 'bg-sky-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Needs Review (Water Log Added)
            </button>
            <button
              onClick={() => setDemoState('ready')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                demoState === 'ready'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Ready for Verification (Geotag Resolved)
            </button>
          </div>
        </div>

        {/* Right: State actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-slate-300 font-mono text-[11px]">
            Completeness: <strong className="text-white">{completenessPercent}%</strong> · Status:{' '}
            <span
              className={`font-semibold ${
                assessmentStatus === 'READY_FOR_VERIFICATION'
                  ? 'text-emerald-400'
                  : assessmentStatus === 'NEEDS_REVIEW'
                  ? 'text-sky-400'
                  : 'text-amber-400'
              }`}
            >
              {assessmentStatus.replace(/_/g, ' ')}
            </span>
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={advanceDemoState}
            className="h-7 text-xs bg-emerald-600/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-600 hover:text-white"
          >
            Advance Step <ArrowRight size={12} className="ml-1" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={resetDemoState}
            title="Reset demonstration state"
            className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <RotateCcw size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
