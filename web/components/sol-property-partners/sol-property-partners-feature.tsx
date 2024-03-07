'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useSolPropertyPartnersProgram } from './sol-property-partners-data-access';
import {
  SolPropertyPartnersCreate,
  SolPropertyPartnersList,
} from './sol-property-partners-ui';

export default function SolPropertyPartnersFeature() {
  const { publicKey } = useWallet();
  const { programId } = useSolPropertyPartnersProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="Sol Property Partners"
        subtitle={
          'Mint an NFT by clicking the "Mint" button. The state of an NFT is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
        }
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <SolPropertyPartnersCreate />
      </AppHero>
      <SolPropertyPartnersList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
