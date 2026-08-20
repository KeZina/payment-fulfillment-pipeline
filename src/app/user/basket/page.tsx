import { StoreNavigation } from "@/app/_components/store-navigation";
import { ProvidersClient } from "@/app/_components/providers";
import { BasketContent } from "./_components/basket-content";

export default function Page() {
  return (
    <ProvidersClient>
      <div className='flex min-h-screen flex-col bg-muted/40'>
        <StoreNavigation />
        <BasketContent />
      </div>
    </ProvidersClient>
  );
}
