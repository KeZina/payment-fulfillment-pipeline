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
- User and admin roles in the database schema.
- Protected basket and checkout routes under `/user`.
- Authenticated account navigation and sign-out.

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
- Inventory decrement after a confirmed sandbox approval.
- Catalog cache invalidation after inventory fulfillment.
- Basket clearing and redirect to the storefront after confirmed success.
- Browser retry guard for pending or unknown transaction results.
- Braintree environment hard-locked to `Sandbox` on the server.

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

Create an untracked `.env` file in the project root:

```dotenv
DATABASE_URL=postgresql://...

BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-stable-random-secret-at-least-32-characters

BRAINTREE_ENVIRONMENT=Sandbox
BRAINTREE_MERCHANT_ID=your-sandbox-merchant-id
BRAINTREE_PUBLIC_KEY=your-sandbox-public-key
BRAINTREE_PRIVATE_KEY=your-sandbox-private-key

# Optional: selects a specific Sandbox merchant account, for example a USD
# merchant account matching the storefront's displayed currency.
BRAINTREE_MERCHANT_ACCOUNT_ID=your-sandbox-merchant-account-id
```

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

> **Database baseline note:** the current migration history assumes the Better
> Auth and catalog tables already exist. It is not yet a complete clean-database
> bootstrap. Review the migration files before running `db:migrate` against a
> new or important database.

```bash
npm run db:migrate
npm run db:seed
```

The seed script loads `.env` and inserts the sample food catalog.

### Other commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Apply Drizzle migrations |
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
transaction and applies the inventory decrement through a guarded SQL
statement. Only a fulfilled ledger entry is returned to the browser as a
successful checkout.

## Current limitations

- Braintree Sandbox only; production Braintree is deliberately unsupported.
- The storefront currently displays prices in `en-US` USD.
- Delivery details are validated but are not persisted yet.
- There is no full order, order-line, fulfillment, refund, webhook, or customer
  order-history workflow yet.
- The account settings and history links do not have pages yet.
- The basket is local to one browser rather than synchronized to a user account.
- Product artwork is currently illustrative placeholder UI.
- Automated tests and continuous integration are not set up yet.
- The current TypeScript 7 and typescript-eslint combination prevents the lint
  command from starting until the tooling versions are aligned.

## Project structure

```text
src/
├── app/                  Next.js pages, route handlers, and feature UI
├── components/           Shared navigation, search, toolbar, and UI primitives
├── db/                   Drizzle connection, schemas, migrations, and seed data
├── hooks/                Catalog fetching hooks
├── lib/                  Client and server integrations
├── schemas/              Valibot runtime validation schemas
├── stores/               Persisted basket state
├── types/                Shared TypeScript types
└── utils/                Client, server, formatting, and cursor utilities
```
