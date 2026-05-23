import api from "./api";

// GET all available subscription plans (public)
export const getPlans = async () => {
  const res = await api.get("/subscriptions/plans");
  return res.data as { success: boolean; plans: Plan[] };
};

// GET current logged-in user's subscription status
export const getSubscriptionStatus = async () => {
  const res = await api.get("/subscriptions/status");
  return res.data as { success: boolean; subscription: Subscription; role: string };
};

// POST create a Stripe Checkout session for a plan
export const createCheckoutSession = async (planId: string) => {
  const res = await api.post("/subscriptions/checkout", { planId });
  return res.data as { success: boolean; url: string };
};

// POST confirm subscription payment and activate Pro on the user
export const confirmSubscriptionPayment = async (
  sessionId: string,
  planId: string
) => {
  const res = await api.post("/subscriptions/confirm", { sessionId, planId });
  return res.data as { success: boolean; message: string; subscription: Subscription };
};

// GET all subscriptions (admin only)
export const getAllSubscriptions = async () => {
  const res = await api.get("/subscriptions/admin/all");
  return res.data as { success: boolean; subscriptions: any[] };
};

// ----------- Shared types -----------

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  description: string;
}

export interface Subscription {
  planType: string;
  isPro: boolean;
  trialUsed: number;
  expiryDate?: string;
  trialStartedAt?: string;
}
