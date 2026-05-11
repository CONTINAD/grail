/**
 * Grail fee calculator
 *
 * Philosophy: always cheaper than eBay (12-15%) and Fanatics (10%+).
 * Flat fees on trade value + small % on any cash component only.
 */

export interface FeeBreakdown {
  tradeFee: number      // flat fee on the trade itself
  cashFeeRate: number   // % applied to cash component
  cashFee: number       // dollar amount of cash fee
  total: number
}

/**
 * Calculate the platform fee for a trade.
 * @param tradeValue  Combined estimated value of cards exchanged (USD)
 * @param cashAmount  Any cash sweetener involved (USD)
 */
export function calculateFee(
  tradeValue: number,
  cashAmount = 0
): FeeBreakdown {
  let tradeFee: number;

  if (tradeValue === 0) {
    tradeFee = 0.50; // local / value-unknown trades
  } else if (tradeValue < 20) {
    tradeFee = 1.00;
  } else if (tradeValue < 100) {
    tradeFee = 2.00;
  } else if (tradeValue < 500) {
    tradeFee = 4.00;
  } else {
    tradeFee = 6.00; // cap — high-value trades still way cheaper than eBay
  }

  const cashFeeRate = 0.02; // 2% on cash component only
  const cashFee = Number((Math.abs(cashAmount) * cashFeeRate).toFixed(2));

  return {
    tradeFee,
    cashFeeRate,
    cashFee,
    total: Number((tradeFee + cashFee).toFixed(2)),
  };
}

/** Human-readable fee summary */
export function formatFeeLabel(breakdown: FeeBreakdown): string {
  if (breakdown.cashFee > 0) {
    return `$${breakdown.tradeFee.toFixed(2)} trade fee + $${breakdown.cashFee.toFixed(2)} cash fee = $${breakdown.total.toFixed(2)}`;
  }
  return `$${breakdown.tradeFee.toFixed(2)} flat fee`;
}
