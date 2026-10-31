import { useEffect, useState } from 'react';
import { AcreonBrand } from '@/components/acreon-brand';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getMyFarmerAccount } from '@/lib/farmer-account.functions';
import { evidenceStatusLabel } from '@/lib/ops/evidence-upload';

type FarmerAccount = {
  farmer: { name_local?: string | null };
  evidence?: Array<{ status?: string | null }>;
  tasks?: Array<{ status?: string | null }>;
};

function FarmerNavigation() {
  const [farmer, setFarmer] = useState<FarmerAccount | null>(null);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const fetchFarmer = useServerFn(getMyFarmerAccount);
  const q = useQuery({ queryKey: ['my-farmer'], queryFn: () => fetchFarmer(), retry: 0 });

  useEffect(() => {
    if (q.data) setFarmer(q.data);
  }, [q.data]);

  useEffect(() => {
    if (farmer) {
      const f = farmer.farmer;
      const evidence = farmer.evidence ?? [];
      setEvidenceCount(evidence.length);

      const t = farmer.tasks ?? [];
      const pendingTasks = t.filter(r => r.status !== 'completed');
      setTasksCount(pendingTasks.length);
    }
  }, [farmer]);

  if (!farmer) return null;

  return (
    <nav className="fportal-nav">
      <div className="fportal-nav-left">
        <AcreonBrand className="fportal-nav-brand" />
        <span className="fportal-nav-greeting">Sat Sri Akal, <span lang="pa">{farmer.farmer.name_local}</span></span>
      </div>
      <div className="fportal-nav-right">
        <Button variant="ghost" size="sm" onClick={() => window.location.href = '/_authenticated/farmer/dashboard'}>
          Dashboard
        </Button>
        <Button variant="ghost" size="sm" onClick={() => window.location.href = '/register'}>
          Sign in
        </Button>
        {evidenceCount > 0 && (
          <Button variant="ghost" size="sm">
            <span className={`fp-badge st-${evidenceStatusLabel(farmer.evidence?.[0]?.status ?? 'pending')}`}>{evidenceCount}</span>
          </Button>
        )}
        {tasksCount > 0 && (
          <Button variant="ghost" size="sm">
            <span className="fp-badge">{tasksCount}</span>
          </Button>
        )}
      </div>
    </nav>
  );
}

export { FarmerNavigation };
