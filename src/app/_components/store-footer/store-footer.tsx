import { storeFooterStyles } from "./store-footer.styles";

export function StoreFooter() {
  return (
    <footer className={storeFooterStyles.root}>
      <div className={storeFooterStyles.inner}>
        <p className={storeFooterStyles.title}>Pantry</p>
        <p>
          A full-stack demo storefront built with Next.js, PostgreSQL, and
          Drizzle. Browse the catalog, persist a basket, and place sandbox
          orders with Braintree Hosted Fields.
        </p>
        <p className={storeFooterStyles.notice}>
          Braintree Sandbox — no real funds are charged. Use test card details
          only.
        </p>
      </div>
    </footer>
  );
}
