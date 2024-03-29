'use client';

import {
  SolPropertyPartnersIDL,
  getSolPropertyPartnersProgramId,
} from '@sol-property-partners/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useSolPropertyPartnersProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getSolPropertyPartnersProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(SolPropertyPartnersIDL, programId, provider);

  const accounts = useQuery({
    queryKey: ['sol-property-partners', 'all', { cluster }],
    queryFn: () => program.account.solPropertyPartners.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['sol-property-partners', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ solPropertyPartners: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useSolPropertyPartnersProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useSolPropertyPartnersProgram();

  const accountQuery = useQuery({
    queryKey: ['sol-property-partners', 'fetch', { cluster, account }],
    queryFn: () => program.account.solPropertyPartners.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['sol-property-partners', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ solPropertyPartners: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['sol-property-partners', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods
        .decrement()
        .accounts({ solPropertyPartners: account })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['sol-property-partners', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods
        .increment()
        .accounts({ solPropertyPartners: account })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['sol-property-partners', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods
        .set(value)
        .accounts({ solPropertyPartners: account })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
