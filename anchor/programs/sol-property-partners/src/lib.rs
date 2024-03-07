#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("7TusDqAZkvNBUR66bWQkQxkeqab9Zho4mEqfozJMj9cS");

#[program]
pub mod sol_property_partners {
    use super::*;

  pub fn close(_ctx: Context<CloseSolPropertyPartners>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.sol_property_partners.count = ctx.accounts.sol_property_partners.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.sol_property_partners.count = ctx.accounts.sol_property_partners.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolPropertyPartners>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.sol_property_partners.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSolPropertyPartners<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + SolPropertyPartners::INIT_SPACE,
  payer = payer
  )]
  pub sol_property_partners: Account<'info, SolPropertyPartners>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSolPropertyPartners<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub sol_property_partners: Account<'info, SolPropertyPartners>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub sol_property_partners: Account<'info, SolPropertyPartners>,
}

#[account]
#[derive(InitSpace)]
pub struct SolPropertyPartners {
  count: u8,
}
