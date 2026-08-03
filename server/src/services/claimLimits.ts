export const INITIAL_CLAIM_LIMIT = 1;
export const canMakeInitialClaim = (existingClaims: number) =>
  existingClaims < INITIAL_CLAIM_LIMIT;
