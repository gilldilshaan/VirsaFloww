import React from 'react';
import { RefreshCw, FolderSearch, AlertTriangle, ShieldAlert, Sparkles, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  title?: string;
  message?: string;
  className?: string;
}

export function LoadingState({
  title = 'Loading verification records...',
  message = 'Retrieving parcel telemetry and cryptographic hashes from the MRV index.',
  className = '',
}: LoadingStateProps) {
  return (
    <div
      className={`bg-white border border-[#dfe6d9] rounded-xl p-12 text-center space-y-3 shadow-xs ${className}`}
      role="status"
      aria-live="polite"
    >
      <RefreshCw size={28} className="animate-spin text-[#245b45] mx-auto" />
      <h3 className="font-serif text-lg text-[#193b2a] font-medium">{title}</h3>
      <p className="text-xs text-[#72816f] max-w-md mx-auto leading-relaxed">{message}</p>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No records found',
  message = 'There are no items matching the active filters or date criteria.',
  icon,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`bg-white border border-[#dfe6d9] rounded-xl p-12 text-center space-y-3 shadow-xs ${className}`}>
      <div className="w-12 h-12 rounded-full bg-[#f4f6f0] flex items-center justify-center mx-auto text-[#5c7c46]">
        {icon || <FolderSearch size={24} />}
      </div>
      <h3 className="font-serif text-lg text-[#193b2a] font-medium">{title}</h3>
      <p className="text-xs text-[#72816f] max-w-md mx-auto leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button size="sm" onClick={onAction} className="bg-[#245b45] text-white hover:bg-[#1a4333] text-xs">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: string | Error;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Unable to load verification data',
  message = 'An error occurred while communicating with the MRV verification service.',
  error,
  onRetry,
  className = '',
}: ErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={`bg-white border border-red-200 rounded-xl p-10 text-center space-y-3 shadow-xs ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-600">
        <AlertTriangle size={24} />
      </div>
      <h3 className="font-serif text-lg text-red-950 font-medium">{title}</h3>
      <p className="text-xs text-[#72816f] max-w-md mx-auto leading-relaxed">{message}</p>
      {errorMessage && (
        <pre className="text-[11px] font-mono bg-red-50 text-red-800 p-2.5 rounded-lg max-w-lg mx-auto overflow-x-auto border border-red-100">
          {errorMessage}
        </pre>
      )}
      {onRetry && (
        <div className="pt-2">
          <Button size="sm" onClick={onRetry} className="bg-red-700 text-white hover:bg-red-800 text-xs">
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
}

interface UnauthorizedStateProps {
  title?: string;
  message?: string;
  requiredRole?: string;
  className?: string;
}

export function UnauthorizedState({
  title = 'Access Restricted',
  message = 'You do not have permission to view internal auditor records or perform certification actions.',
  requiredRole = 'Auditor / Field Lead',
  className = '',
}: UnauthorizedStateProps) {
  return (
    <div className={`bg-white border border-amber-200 rounded-xl p-12 text-center space-y-3 shadow-xs ${className}`}>
      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-600">
        <ShieldAlert size={24} />
      </div>
      <h3 className="font-serif text-lg text-amber-950 font-medium">{title}</h3>
      <p className="text-xs text-[#72816f] max-w-md mx-auto leading-relaxed">{message}</p>
      <div className="inline-block bg-[#f4f6f0] border border-[#dfe6d9] rounded px-2.5 py-1 text-[11px] font-mono text-[#5c7c46]">
        Required Role: {requiredRole}
      </div>
    </div>
  );
}

interface DemoDataBadgeProps {
  isMock?: boolean;
  sourceLabel?: string;
  className?: string;
}

export function DemoDataBadge({
  isMock = true,
  sourceLabel = 'Verified Punjab Kharif Fixtures',
  className = '',
}: DemoDataBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-tight border ${
        isMock
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
      } ${className}`}
      title={isMock ? 'Data populated from demonstration fixture dataset.' : 'Live data connected via API adapter.'}
    >
      {isMock ? (
        <>
          <Sparkles size={11} className="text-amber-600 shrink-0" />
          <span>Demo Data · {sourceLabel}</span>
        </>
      ) : (
        <>
          <Database size={11} className="text-emerald-600 shrink-0" />
          <span>Live API Connection</span>
        </>
      )}
    </span>
  );
}
