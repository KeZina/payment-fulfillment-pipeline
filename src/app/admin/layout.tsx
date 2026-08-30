import { ProvidersClient } from "@/app/_components/providers";
import { StoreNavigation } from "@/app/_components/store-navigation";
import type { WithChildren } from "@/types";

// The admin session/role guard intentionally stays in each page's content
// component (inside its <Suspense> boundary) rather than here: reading
// headers()/cookies() in a layout, above any Suspense boundary, blocks
// static prerendering of the whole route under Cache Components.
export default function AdminLayout({ children }: WithChildren) {
  return (
    <ProvidersClient>
      <div className='flex min-h-screen flex-col bg-muted/40'>
        <StoreNavigation />
        {children}
      </div>
    </ProvidersClient>
  );
}
