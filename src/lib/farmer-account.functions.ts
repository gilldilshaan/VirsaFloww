import { createServerFn } from '@tanstack/react-start';

export const getMyFarmerAccount = createServerFn({ method: 'GET' }).handler(async () => {
  return {
    farmer: { name_local: 'ਗੁਰਦੇਵ ਸਿੰਘ' },
    evidence: [{ status: 'verified' }, { status: 'pending' }],
    tasks: [{ status: 'active' }],
  };
});
