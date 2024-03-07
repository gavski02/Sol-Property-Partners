// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { SolPropertyPartners } from '../target/types/sol_property_partners';
import { IDL as SolPropertyPartnersIDL } from '../target/types/sol_property_partners';

// Re-export the generated IDL and type
export { SolPropertyPartners, SolPropertyPartnersIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const SOL_PROPERTY_PARTNERS_PROGRAM_ID = new PublicKey(
  '7TusDqAZkvNBUR66bWQkQxkeqab9Zho4mEqfozJMj9cS'
);

// This is a helper function to get the program ID for the SolPropertyPartners program depending on the cluster.
export function getSolPropertyPartnersProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return SOL_PROPERTY_PARTNERS_PROGRAM_ID;
  }
}
