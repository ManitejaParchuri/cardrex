-- Phase 5: immutable claim history and guest ownership.
CREATE TABLE "CardClaim" (
    "id" UUID NOT NULL,
    "guestSessionId" UUID NOT NULL,
    "cardId" UUID NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "idempotencyKey" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CardClaim_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GuestCard" (
    "id" UUID NOT NULL,
    "guestSessionId" UUID NOT NULL,
    "cardId" UUID NOT NULL,
    "obtainedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimId" UUID NOT NULL,
    CONSTRAINT "GuestCard_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CardClaim_guestSessionId_key" ON "CardClaim"("guestSessionId");
CREATE UNIQUE INDEX "CardClaim_idempotencyKey_key" ON "CardClaim"("idempotencyKey");
CREATE INDEX "CardClaim_guestSessionId_createdAt_idx" ON "CardClaim"("guestSessionId", "createdAt");
CREATE INDEX "CardClaim_cardId_idx" ON "CardClaim"("cardId");
CREATE UNIQUE INDEX "GuestCard_guestSessionId_key" ON "GuestCard"("guestSessionId");
CREATE UNIQUE INDEX "GuestCard_claimId_key" ON "GuestCard"("claimId");
CREATE INDEX "GuestCard_guestSessionId_obtainedAt_idx" ON "GuestCard"("guestSessionId", "obtainedAt");
CREATE INDEX "GuestCard_cardId_idx" ON "GuestCard"("cardId");
ALTER TABLE "CardClaim" ADD CONSTRAINT "CardClaim_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "GuestSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CardClaim" ADD CONSTRAINT "CardClaim_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GuestCard" ADD CONSTRAINT "GuestCard_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "GuestSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GuestCard" ADD CONSTRAINT "GuestCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GuestCard" ADD CONSTRAINT "GuestCard_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "CardClaim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
