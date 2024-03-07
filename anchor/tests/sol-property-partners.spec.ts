import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { SolPropertyPartners } from '../target/types/sol_property_partners';

describe('sol-property-partners', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace
    .SolPropertyPartners as Program<SolPropertyPartners>;

  const solPropertyPartnersKeypair = Keypair.generate();

  it('Initialize SolPropertyPartners', async () => {
    await program.methods
      .initialize()
      .accounts({
        solPropertyPartners: solPropertyPartnersKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solPropertyPartnersKeypair])
      .rpc();

    const currentCount = await program.account.solPropertyPartners.fetch(
      solPropertyPartnersKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment SolPropertyPartners', async () => {
    await program.methods
      .increment()
      .accounts({ solPropertyPartners: solPropertyPartnersKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solPropertyPartners.fetch(
      solPropertyPartnersKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment SolPropertyPartners Again', async () => {
    await program.methods
      .increment()
      .accounts({ solPropertyPartners: solPropertyPartnersKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solPropertyPartners.fetch(
      solPropertyPartnersKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement SolPropertyPartners', async () => {
    await program.methods
      .decrement()
      .accounts({ solPropertyPartners: solPropertyPartnersKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solPropertyPartners.fetch(
      solPropertyPartnersKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set solPropertyPartners value', async () => {
    await program.methods
      .set(42)
      .accounts({ solPropertyPartners: solPropertyPartnersKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solPropertyPartners.fetch(
      solPropertyPartnersKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the solPropertyPartners account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solPropertyPartners: solPropertyPartnersKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solPropertyPartners.fetchNullable(
      solPropertyPartnersKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
