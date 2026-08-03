# Cardrex MVP architecture and implementation plan

> **Current delivery status:** Phase 1.5 is presentation-only UI polish. Its cosmic
> background, chest reactions, collection preview, and motion do not claim, select, or
> persist cards. Backend, authentication, and secure guest-session work remain deferred
> to the later implementation phases described below.

## 1. Recommended architecture

### Decision: a modular monolith

Build the MVP as one **Next.js TypeScript application** with a PostgreSQL database. The
same deployable should render the mobile UI and expose server-only route handlers for
authentication, claims, and collections. Organize the code into domain modules so that
the claim service can be extracted later, without accepting the operational overhead of
microservices during validation.

| Area | MVP choice | Reason |
| --- | --- | --- |
| Web and API | Next.js (App Router) + TypeScript | One mobile-first application, server rendering, route handlers, and a small deployment surface. |
| UI | React, CSS Modules or Tailwind, reduced-motion variants | Fast construction of a cinematic responsive UI while preserving accessible motion controls. |
| Database | Managed PostgreSQL | Transactions and constraints make claims and ownership reliable. |
| Data access | Prisma ORM with checked-in migrations | Typed queries, explicit schema changes, and transaction support. |
| Authentication | Auth.js with database sessions and an email magic-link or one office-approved OIDC provider | Avoid custom password storage and keep account/session lifecycle server-side. |
| Guest identity | Opaque, random, session-lifetime token in a `Secure`, `HttpOnly`, `SameSite=Lax` cookie; store only its hash in PostgreSQL | Refreshes and navigation in the same browser session recover the guest without exposing an identity credential to JavaScript. |
| Validation | Zod schemas at every HTTP boundary | Share request/response types while treating browser input as untrusted. |
| Artwork | Original optimized AVIF/WebP assets in object storage behind a CDN | Keeps binaries outside the database and supports responsive delivery. |
| Testing | Vitest, React Testing Library, and Playwright | Covers domain logic, UI states, API integration, and the mobile claim flow. |
| Observability | Structured server logs, request IDs, error reporting, and basic claim counters | Enough evidence to diagnose failures without logging secrets. |

Deploy the application and database in the same region. Use a pooled database
connection appropriate to the host. A Redis dependency is not necessary initially:
PostgreSQL can enforce claim idempotency and a platform/WAF limiter can provide coarse
rate limits. Add Redis only when distributed, fine-grained limiting or queues become a
measured need.

### Runtime boundaries

1. The QR code opens a stable HTTPS URL such as `/q/{campaignPublicId}`. A public ID is
   an identifier, not an authorization secret.
2. Middleware creates or resumes a guest session. A generated display name is editable,
   but it is never used as the identity key.
3. The claim page fetches public campaign state. The browser never receives weights,
   unpublished card inventory, or a rarity choice.
4. `POST /api/claims` accepts the campaign ID and an idempotency key. The server resolves
   the authenticated account or hashed guest session, validates campaign eligibility,
   chooses an eligible card using a cryptographically secure random source, and inserts
   the claim plus collection item in one database transaction.
5. Only after commit does the API return the awarded card. The client uses that result to
   run the mystery-box animation; animation failure cannot lose or duplicate the award.
6. Signing in can transactionally attach the guest's collection to the account after an
   explicit confirmation. The original guest record remains auditable and cannot be
   merged twice.

### Claim selection rule

Keep selection in a server-only domain service. Load active `campaign_card` rows, derive
their effective weights, generate an unbiased integer with the platform crypto API, and
walk the cumulative weight ranges. Do not use `Math.random`, a client-generated result,
or a rarity supplied by the request. For small MVP pools, row locking plus a transaction
is sufficient; if finite inventory is enabled, lock candidate inventory and retry a
bounded number of serialization conflicts.

Store a snapshot of the selected weight/configuration version on each claim. This makes
an award explainable after campaign settings change. Do not reveal exact weights in API
responses unless product policy intentionally makes odds public.

## 2. Detailed implementation plan

### Foundation

- Initialize strict TypeScript, formatting, linting, environment validation, and CI.
- Define separate browser-safe and server-only configuration modules; fail startup when
  required secrets or database URLs are missing.
- Establish the theme tokens for background, surfaces, focus states, and each rarity.
- Add global error boundaries, a not-found view, structured logging, and request IDs.

### Identity and entry

- Resolve and validate the QR campaign public ID on the server, then redirect to the
  canonical claim route without leaking internal IDs.
- Create 256-bit opaque guest tokens using a cryptographically secure generator. Put the
  raw token only in a session cookie and a SHA-256/HMAC hash in `guest_sessions`.
- Generate a validated, non-unique temporary display name. Provide a guest continuation
  action and account sign-in action without making authentication a prerequisite.
- Configure Auth.js database sessions, CSRF protection, cookie security, and the selected
  provider. Add an authenticated account view and sign-out.
- Implement a deliberate guest-to-account collection merge that is transactional,
  idempotent, logged, and protected from cross-user merging.

### Card catalogue and campaign administration

- Seed only licensed/original character metadata and artwork references. Record creator
  and provenance notes before publishing an asset.
- Build server-side catalogue repositories and a minimal, access-controlled seed/import
  workflow rather than an admin UI for the first release.
- Validate rarity weights as positive integers, reject empty pools, and ensure only
  published cards with available inventory can be activated.

### Claim API

- Require a valid account or guest session, a valid active campaign, and an idempotency
  key. Set a small body limit and reject unknown fields.
- In one transaction, enforce campaign limits, select with secure randomness, decrement
  finite inventory if configured, insert the immutable claim, and insert ownership.
- Add uniqueness constraints as the final defense against repeat claims. Return the
  existing result when an idempotency key is replayed by the same identity.
- Use stable error codes (`CAMPAIGN_INACTIVE`, `ALREADY_CLAIMED`, `RATE_LIMITED`) and safe
  user messages. Never return stack traces, SQL details, weights, or session identifiers.
- Apply IP/session/account rate limits and log suspicious repeated attempts without
  storing raw guest tokens or unnecessary personal data.

### Mobile experience

- Build 320 px-first screens for entry, identity choice, claim, reveal, collection,
  card detail, loading, offline, empty, and recoverable error states.
- Preload only the awarded asset needed for reveal. Animate transform and opacity on the
  compositor, preserve a minimum 44 px target size, and prevent double taps while the
  request is pending.
- Honor `prefers-reduced-motion`, provide a skip control, keep semantic headings and live
  status announcements, and verify keyboard/screen-reader focus after reveal.
- Map rarity to centralized visual tokens. Do not rely on border color alone: show a text
  label and accessible name.

### Quality and release

- Add unit tests for weighted selection boundaries, configuration validation, guest
  token hashing, claim policy, and error mapping.
- Add database integration tests for transactions, concurrent claims, inventory
  exhaustion, uniqueness, replayed idempotency keys, and guest merge behavior.
- Add component tests for every card field, loading/error states, reduced motion, and
  prevention of repeat submission.
- Add Playwright journeys at small mobile widths for guest claim, returning guest,
  signed-in claim, interrupted reveal recovery, and collection detail.
- Run lint, type checks, tests, migration validation, dependency auditing, accessibility
  checks, and a production build in CI. Exercise restore procedures before launch.

## 3. Proposed database schema

Use UUID primary keys and `timestamptz` timestamps. Use application enums for readability
but validate changes through migrations. `created_at` is required unless noted.

### Identity

**`users`**

- `id uuid primary key`
- `email text unique` (nullable when the selected identity provider does not supply one)
- `display_name varchar(40)`
- `created_at`, `updated_at`, `disabled_at`

Auth.js adapter tables (`accounts`, `sessions`, and `verification_tokens`) follow the
adapter's supported schema. Database-backed sessions should contain hashed/opaque
credentials according to the adapter's contract.

**`guest_sessions`**

- `id uuid primary key`
- `token_hash bytea unique not null`
- `display_name varchar(40) not null`
- `created_at`, `last_seen_at`, `expires_at`, `revoked_at`
- `merged_into_user_id uuid references users(id)` nullable
- check constraints for display-name length and `expires_at > created_at`

The cookie is a browser-session cookie even though the server record has a bounded
expiry for cleanup and credential-risk reduction. Closing the browser is the promised
recovery boundary; browser features that restore sessions may preserve session cookies.

### Catalogue

**`cards`**

- `id uuid primary key`
- `card_number varchar(32) unique not null` (public stable number)
- `name varchar(80) not null`
- `rarity rarity_enum not null` (`COMMON`, `UNCOMMON`, `RARE`, `EPIC`, `LEGENDARY`,
  `MYTHIC`, `RAINBOW`, `SECRET`)
- `lore text not null`
- `attack smallint not null`, `defense smallint not null` with non-negative checks
- `special_ability_name varchar(80) not null`, `special_ability_text text not null`
- `artwork_url text not null`, `artwork_alt text not null`
- `artwork_sha256 char(64) not null`, `provenance_note text not null`
- `published_at`, `retired_at`, `created_at`, `updated_at`

**`campaigns`**

- `id uuid primary key`, `public_id varchar(32) unique not null`
- `name varchar(100) not null`, `starts_at`, `ends_at`, `active boolean not null`
- `max_claims_per_identity smallint not null default 1`
- `rules_version integer not null`, `created_at`, `updated_at`

**`campaign_cards`**

- `campaign_id uuid references campaigns(id)`
- `card_id uuid references cards(id)`
- `weight integer not null check (weight > 0)`
- `inventory_limit integer` nullable, `inventory_awarded integer not null default 0`
- `active boolean not null default true`
- composite primary key (`campaign_id`, `card_id`)
- checks that inventory values are non-negative and awarded does not exceed the limit

Weights belong to individual eligible cards. This permits multiple cards at one rarity
and avoids a second random choice whose interaction with rarity odds is easy to
misconfigure. A later admin tool can present rarity-level controls and compile them into
card weights.

### Awards and ownership

**`claims`** (immutable award ledger)

- `id uuid primary key`
- exactly one of `user_id uuid references users(id)` or
  `guest_session_id uuid references guest_sessions(id)` at creation, enforced by a check
- `campaign_id uuid references campaigns(id)` and `card_id uuid references cards(id)`
- `idempotency_key_hash bytea not null`
- `rules_version integer not null`, `selected_weight integer not null`
- `claimed_at timestamptz not null`, `request_id uuid not null`
- unique partial indexes on (`user_id`, `campaign_id`, `idempotency_key_hash`) and
  (`guest_session_id`, `campaign_id`, `idempotency_key_hash`)

Add policy-dependent unique partial indexes for the campaign limit. The default
one-per-identity campaign uses (`user_id`, `campaign_id`) and
(`guest_session_id`, `campaign_id`). If multiple claims are allowed, use a transactionally
allocated claim ordinal and a unique (`identity`, `campaign_id`, `ordinal`) key.

**`collection_items`**

- `id uuid primary key`, `claim_id uuid unique references claims(id)`
- exactly one current owner: `user_id` or `guest_session_id`, enforced by a check
- `card_id uuid references cards(id)` (denormalized for efficient collection queries)
- `acquired_at timestamptz not null`
- indexes on (`user_id`, `acquired_at desc`) and
  (`guest_session_id`, `acquired_at desc`)

`claims` preserves who received the award; `collection_items` represents current
ownership and can move during a guest merge. A future trading feature should replace
direct owner updates with an ownership event ledger.

**`guest_merge_events`**

- `id uuid primary key`
- `guest_session_id uuid unique references guest_sessions(id)`
- `user_id uuid references users(id)`
- `merged_at timestamptz not null`, `item_count integer not null`

## 4. Proposed folder structure

```text
cardrex/
├── app/
│   ├── (public)/q/[campaignPublicId]/page.tsx
│   ├── (app)/claim/[campaignPublicId]/page.tsx
│   ├── (app)/collection/page.tsx
│   ├── (app)/cards/[cardNumber]/page.tsx
│   ├── api/claims/route.ts
│   ├── api/guest/route.ts
│   ├── api/guest/merge/route.ts
│   ├── auth/[...nextauth]/route.ts
│   ├── error.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── card/
│   ├── claim/
│   ├── identity/
│   └── ui/
├── modules/
│   ├── auth/               # session resolution and account policies
│   ├── campaigns/          # campaign repository and eligibility
│   ├── cards/              # catalogue domain and presentation mapping
│   ├── claims/             # orchestration, secure selection, idempotency
│   ├── collections/        # ownership queries and guest merge
│   └── guests/             # token lifecycle and display-name policy
├── server/
│   ├── db.ts
│   ├── env.ts
│   ├── logging.ts
│   ├── rate-limit.ts
│   └── request-context.ts
├── lib/                    # browser-safe utilities only
├── styles/tokens.css
├── public/                 # icons; production card art may live on a CDN
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── components/
│   └── e2e/
├── docs/
├── middleware.ts
└── package.json
```

Route handlers should be thin adapters: parse, authenticate, invoke one domain use case,
and map the result to HTTP. Domain modules must not import React. Mark database, secret,
and claim-selection modules as server-only so bundling fails if a client component tries
to import them.

## 5. Security and privacy risks

| Risk | Required mitigation |
| --- | --- |
| Browser manipulates rarity/card | Ignore all requested award fields; select from server-loaded eligible rows with cryptographic randomness and return only the committed result. |
| Duplicate or concurrent claims | Database transaction, identity/campaign unique constraints, row locking where inventory is finite, and scoped idempotency keys. Never rely only on a disabled button. |
| Guessable QR URL or replay | Treat QR IDs as public; enforce eligibility and limits on every claim. Rotate/disable campaigns when needed. Do not put bearer credentials in the QR URL. |
| Guest session theft/fixation | At least 256 bits of randomness, hashed token storage, secure HttpOnly session cookie, token rotation after privilege changes, expiry/revocation, and no tokens in logs or URLs. |
| Unsafe account merge | Require a freshly authenticated target account and the current guest credential; lock both, allow one merge, and record the event. Never accept arbitrary identity IDs. |
| CSRF | SameSite cookies, Auth.js protections, origin validation for mutations, and framework-supported anti-CSRF tokens where appropriate. |
| XSS and asset injection | React escaping, strict validation, no untrusted HTML, a restrictive CSP with nonces, allowlisted image origins, and safe security headers. |
| SQL injection/mass assignment | Parameterized ORM calls, explicit input schemas, explicit selected/updated fields, and least-privilege database credentials. |
| Brute force/abuse and denial of inventory | Layered IP plus identity limits, request/body/time limits, monitoring, and WAF rules. Avoid permanent decisions based only on shared-office IPs. |
| Information leakage | Generic external errors, authorization before existence checks, redacted structured logs, no source maps/secrets exposed publicly, and no unpublished catalogue data in bundles. |
| Biased or predictable odds | Crypto RNG, integer weights, reviewed configuration, boundary/statistical tests, versioned rule snapshots, and no modulo reduction unless the crypto API guarantees unbiased ranges. |
| Broken authorization | Central policy functions, deny by default, object-level checks on every collection/card operation, and negative integration tests. |
| Supply-chain/secrets risk | Lockfile, automated dependency review, secret manager, scoped credentials, rotation plan, and CI scanning. |
| Original-art rights/privacy | Provenance and approval records, metadata stripping where appropriate, takedown process, minimal personal-data collection, retention rules, and a privacy notice. |

Avoid fingerprinting as a substitute for identity: it is privacy-invasive and unreliable.
Guest recovery is deliberately limited to possession of the session cookie. If recovery
across browser restarts/devices becomes a requirement, offer account linking or an
explicit recovery code rather than silently weakening the session model.

## 6. Small delivery phases

Each phase should be independently reviewable and releasable behind a feature flag.

1. **Foundation:** scaffold the application, CI, theme tokens, environment validation,
   database connection, logging, baseline headers, and health checks.
2. **Catalogue:** migrate/seed cards and campaigns, validate all eight rarities, serve
   responsive original artwork, and render static card/detail components.
3. **Guest entry:** implement QR routing, guest session cookie lifecycle, temporary-name
   editing, identity choice, and returning-session tests.
4. **Secure claim:** implement eligibility, crypto-weighted selection, transaction,
   inventory, idempotency, rate limiting, and concurrency/security tests before animation.
5. **Reveal and collection:** build the accessible mystery-box sequence, recovery after
   interruption, collection list/detail, responsive/performance checks, and reduced motion.
6. **Accounts and merge:** enable one authentication provider, account sessions,
   guest-to-account merge, conflict behavior, and authenticated collection access.
7. **Hardening and pilot:** run accessibility and threat-model reviews, tune mobile asset
   delivery, add dashboards/alerts and backup restore verification, then pilot with one
   low-inventory-risk office campaign.

### MVP acceptance criteria

- A fresh browser can scan, continue as guest, claim exactly one eligible card, refresh,
  and still see it during that browser session.
- Replayed, concurrent, edited, and unauthenticated claim requests cannot change rarity,
  exceed policy, or produce duplicate awards.
- An interrupted/reduced-motion reveal leads to the same already-committed card.
- Every rendered card includes artwork, name, rarity text, lore, attack, defense, special
  ability, public card number, and a rarity-specific border/token.
- A guest can sign in and merge once without losing or duplicating collection items.
- CI passes unit, integration, component, end-to-end, type, lint, migration, accessibility,
  dependency, and production-build checks.

## Deferred until evidence justifies it

- Trading, marketplaces, social feeds, native apps, WebSockets, microservices, a Redis
  cluster, a full admin console, user-uploaded artwork, blockchain/NFT integration, and
  complex anti-fraud fingerprinting.
- Multi-region writes and provably fair/public randomness. If awards later gain monetary
  value, obtain legal review and redesign randomness, auditability, abuse controls, terms,
  and regional eligibility before launch.
