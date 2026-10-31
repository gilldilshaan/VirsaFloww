import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { useAuth } from '@/lib/auth/auth-context';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BuyerEnquiryScreen() {
  const { submitBuyerInquiry } = useTerraLedger();
  const { user } = useAuth();

  const [projectTitle, setProjectTitle] = useState('Punjab Direct Seeded Rice MRV Cluster #1');
  const [volume, setVolume] = useState('2500');
  const [vintage, setVintage] = useState('2026');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitBuyerInquiry({
      buyerName: user?.name || 'Marcus Vance',
      buyerOrg: user?.buyerOrgId || 'Aura Climate Asset Management',
      projectTitle,
      volumeRequestedTons: Number(volume) || 1000,
      targetRetirementYear: vintage,
    });
    setSuccessMessage(res.message);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader
        title="Submit Carbon Offtake Inquiry"
        description="Request forward offtake allocation or digital data room inspection for verified agricultural carbon projects."
      />

      {successMessage ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-2">
          <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
          <h3 className="font-serif text-lg text-[#193b2a]">Inquiry Registered</h3>
          <p className="text-xs text-[#72816f]">{successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs space-y-4 text-xs">
          <div>
            <label className="font-medium text-[#193b2a] block mb-1">Target Project</label>
            <select
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none"
            >
              <option>Punjab Direct Seeded Rice MRV Cluster #1</option>
              <option>Malwa Zero-Till & Residue Management Hub</option>
              <option>Patiala Basin Precision Alternate Wetting & Drying</option>
              <option>Doaba Agroforestry & Poplar Biomass Intercrop</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-[#193b2a] block mb-1">Volume (tCO2e)</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-[#193b2a] block mb-1">Target Retirement Vintage</label>
              <input
                type="text"
                value={vintage}
                onChange={(e) => setVintage(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" size="sm" className="bg-[#245b45] text-white hover:bg-[#1a4333]">
              Submit Inquiry
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export const Route = createFileRoute('/buyers/enquiry')({
  component: BuyerEnquiryScreen,
});
