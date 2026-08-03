CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'RAINBOW', 'SECRET');

CREATE TABLE "Card" (
  "id" UUID NOT NULL,
  "name" VARCHAR(80) NOT NULL,
  "slug" VARCHAR(100) NOT NULL,
  "rarity" "Rarity" NOT NULL,
  "description" VARCHAR(240) NOT NULL,
  "lore" VARCHAR(500) NOT NULL,
  "attack" INTEGER NOT NULL,
  "defense" INTEGER NOT NULL,
  "abilityName" VARCHAR(80) NOT NULL,
  "abilityDescription" VARCHAR(240) NOT NULL,
  "imageUrl" VARCHAR(255) NOT NULL,
  "collectionNumber" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Card_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Card_attack_non_negative" CHECK ("attack" >= 0),
  CONSTRAINT "Card_defense_non_negative" CHECK ("defense" >= 0)
);

CREATE UNIQUE INDEX "Card_slug_key" ON "Card"("slug");
CREATE UNIQUE INDEX "Card_collectionNumber_key" ON "Card"("collectionNumber");
CREATE INDEX "Card_active_rarity_collectionNumber_idx" ON "Card"("active", "rarity", "collectionNumber");
