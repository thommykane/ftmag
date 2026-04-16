/** Stripe subscription statuses that count as “paid” for the admin list. */
export function subscriptionGrantsPaidAccess(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}
