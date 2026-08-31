# Food Storefront with Braintree Sandbox

A full-stack food storefront built with Next.js. Customers can browse and
filter a server-backed catalog, authenticate, keep a basket between visits, and
complete a simulated card checkout through Braintree Sandbox Hosted Fields.

> **Work in progress:** the payment integration is hard-locked to Braintree
> Sandbox. It cannot create real-money transactions.

## Features available today

### Catalog

- Server-backed food catalog stored in PostgreSQL.
- Cursor-based pagination with infinite scrolling.
- Debounced name and description search.
- URL-backed filters for discounted and in-stock products.
- Price sorting and configurable page size.
- Current stock, low-stock, out-of-stock, and sale-price states.
- Cached initial catalog page with invalidation after fulfilled checkout.

### Authentication

- Email and password sign-up and sign-in with Better Auth.
- PostgreSQL-backed users, accounts, sessions, and verification records.
- Better Auth admin plugin with server-controlled roles and admin-only routes.
- New accounts always receive the `user` role; `role` is not client-writable.
- A signed-in admin can promote another user via Better Auth’s
  `/admin/set-role` endpoint.
- The first admin must be created directly in PostgreSQL (see below).
- Protected basket, checkout, order history, and settings routes under `/user`.
- Protected admin routes under `/admin` with role checks at the edge proxy and
  in server components and actions.
- Authenticated account navigation, admin link for admin users, and sign-out.

### Admin

- Admin overview at `/admin` with store-wide order count, revenue, and recent
  orders.
- Catalog management at `/admin/items` with server-rendered search, pagination,
  and inline editing of price, discount, and stock.
- Server Actions for catalog updates with Valibot validation and catalog cache
  invalidation.
- Admin session guards shared between page renders and mutations.

### Basket

- Add, remove, increment, and decrement product quantities.
- Quantity controls constrained by the stock snapshot held by the basket.
- Browser persistence with Zustand and `localStorage`.
- Runtime validation of restored basket data.
- Basket search, item count, and subtotal summary.
- Empty and no-search-results states.

### Braintree Sandbox checkout

- Delivery details form with client and server validation.
- Braintree Hosted Fields for card number, expiration date, CVV, and postal
  code.
- Card data stays inside Braintree-hosted iframes; the application receives a
  one-time payment method nonce.
- Authenticated, same-origin client-token and checkout endpoints.
- Server-authoritative price and stock validation before each sandbox sale.
- Exact decimal amount calculation on the server.
- Request idempotency key forwarded to Braintree and recorded locally.
- Sandbox transaction ledger with provider transaction details.
- Order and order-line-item records with snapshotted product names and prices.
- Persisted delivery details (name, email, phone, address, and instructions).
- Inventory decrement after a confirmed sandbox approval.
- Catalog cache invalidation after inventory fulfillment.
- Basket clearing and redirect to the storefront after confirmed success.
- Browser retry guard for pending or unknown transaction results.
- Braintree environment hard-locked to `Sandbox` on the server.

### Order history

- Authenticated order list at `/user/history`.
- Order receipt page at `/user/history/[orderId]` with delivery details and
  snapshotted line items.
- Orders linked to the sandbox transaction ledger through an idempotency key.
- Line-item names and prices captured at checkout time, so history stays
  accurate if catalog prices change later.
- Empty state for users with no fulfilled orders yet.

### Account settings

- Authenticated profile and password management at `/user/settings`.
- Account deletion with confirmation.

### Navigation and search

- Sticky storefront navigation with route-aware search behavior.
- Debounced catalog search on the storefront, instant filtering in the basket,
  non-shallow server navigation on the admin catalog, and hidden search on
  checkout, settings, history, and admin overview routes.

## Technology

- Next.js 16 App Router with Cache Components and React Compiler
- React 19 and TypeScript
- PostgreSQL on Neon
- Drizzle ORM and Drizzle Kit
- Better Auth
- Braintree Node SDK and Braintree Web Hosted Fields
- Valibot and TanStack Form
- Zustand with persisted browser storage
- SWR and `nuqs`
- Tailwind CSS and shadcn/ui on Base UI

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Product catalog, search, filters, and basket actions |
| `/sign-in` | Email and password sign-in |
| `/sign-up` | Account creation |
| `/user/basket` | Authenticated basket review |
| `/user/checkout` | Delivery form and Braintree Sandbox Hosted Fields |
| `/user/history` | Authenticated order history list |
| `/user/history/[orderId]` | Order receipt with delivery details and line items |
| `/user/settings` | Authenticated profile, password, and account management |
| `/admin` | Admin overview with order stats and recent orders |
| `/admin/items` | Admin catalog management with search and pagination |
| `/api/items` | Validated, cursor-paginated catalog API |
| `/api/auth/[...all]` | Better Auth handler |
| `/api/braintree/client-token` | Authenticated Sandbox client-token endpoint |
| `/api/braintree/checkout` | Authenticated Sandbox transaction endpoint |

## Local development

### Requirements

- Node.js 20.9 or newer
- A PostgreSQL database
- A Braintree Sandbox account

### Environment

Create an untracked `.env` file in the project root from the example:

```bash
cp .env.example .env
# Windows: copy .env.example .env
```

Then fill in your database and Braintree Sandbox values.

`BRAINTREE_MERCHANT_ID` and `BRAINTREE_MERCHANT_ACCOUNT_ID` are different
values. The merchant ID is a required gateway credential. The optional merchant
account ID selects a particular processing account and currency; when omitted,
Braintree uses the Sandbox account's default merchant account.

Sandbox test card numbers are entered manually in Hosted Fields. They are not
required application environment variables, and the application does not read
or expose them.

Never commit `.env`, Braintree credentials, client tokens, payment method
nonces, or Better Auth secrets.

### Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Database commands

Schema changes live in `src/db/schemas`. This repository does not commit
Drizzle migration files. Bootstrap or update a database directly from the
current schema with:

```bash
npm run db:push
npm run db:seed
```

Use `drizzle-kit generate` only if you want to start maintaining versioned SQL
migrations locally. It is optional and not required to run the app.

The seed script loads `.env` and inserts the sample food catalog.

#### First admin (database only)

Sign up through the app first, then promote that account in PostgreSQL. The
application cannot create the initial admin on its own.

```sql
UPDATE "user"
SET role = 'admin'
WHERE email = 'you@example.com';
```

Sign out and sign back in so the session picks up the new role.

#### Promoting additional admins

An existing admin can grant the admin role to another user through Better Auth’s
admin API (`POST /api/auth/admin/set-role`). Non-admin sessions cannot change
roles.

### Other commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Sync the Drizzle schema to PostgreSQL |
| `npm run db:seed` | Seed the sample catalog from `.env` |

## Checkout security boundary

The browser sends item IDs, requested quantities, delivery details, a payment
method nonce, an expected display amount, and an idempotency key. The server
does not trust basket names, prices, totals, or stock values from
`localStorage`.

Before creating a Sandbox sale, the server:

1. Verifies the request origin and authenticated session.
2. Validates the request body and size.
3. Reads current product prices and quantities from PostgreSQL.
4. Recalculates the total using integer cents.
5. Rejects changed prices, missing products, or insufficient stock.
6. Uses only the server-side Sandbox gateway credentials.

After Braintree reports approval, the application records the Sandbox
transaction, decrements inventory through a guarded SQL statement, and persists
an order with delivery details and snapshotted line items. Only a fulfilled
ledger entry is returned to the browser as a successful checkout.

## Current limitations

- Braintree Sandbox only; production Braintree is deliberately unsupported.
- The storefront currently displays prices in `en-US` USD.
- There is no refund flow or Braintree webhook handling yet.
- The basket is local to one browser rather than synchronized to a user account.
- Product artwork is served from base64 blobs stored in PostgreSQL. Cold image
  requests can be slower on first load; that trade-off is acknowledged and is
  sufficient for this storefront for now.

## Project structure

```text
src/
├── app/                  Next.js pages, route handlers, and feature UI
│   ├── admin/            Admin overview and catalog management
│   └── actions/          Server Actions, including admin catalog updates
├── components/           Shared navigation, search, toolbar, and UI primitives
├── constants/            App-wide and admin-specific constants
├── db/                   Drizzle connection, schemas, migrations, and seed data
├── hooks/                Catalog fetching hooks
├── lib/                  Client and server integrations
├── schemas/              Valibot runtime validation schemas
├── stores/               Persisted basket state
├── types/                Shared TypeScript types
└── utils/                Client, server, formatting, and cursor utilities
```
