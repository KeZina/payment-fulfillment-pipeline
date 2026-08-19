import { cn } from "@/lib";
import {
  foodIllustrationClasses,
  foodIllustrationPlaceholderClass,
} from "./item-card.styles";
import { ItemCardProps } from "./item-card.types";

export function ItemCard({ item, isPlaceholder }: ItemCardProps) {
  // Keep the accent varied while rendering the same class on the server and client.
  const accentClass = isPlaceholder
    ? foodIllustrationPlaceholderClass
    : foodIllustrationClasses[item.id % foodIllustrationClasses.length];

  return (
    <div
      className={cn(
        "group flex h-full w-36 min-w-[9rem] flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:z-10 hover:-translate-y-1 hover:rotate-[-3deg] hover:scale-[1.04] hover:shadow-md will-change-transform transform-gpu origin-center",
        isPlaceholder && "opacity-50",
      )}
    >
      <div className='mb-3 overflow-hidden rounded-lg border border-slate-100 bg-slate-50'>
        <div
          className={`relative h-24 w-full bg-gradient-to-br ${accentClass}`}
        >
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.65),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.35),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0))]' />
          <div className='absolute left-3 top-3 h-8 w-8 rounded-full border-2 border-white/80 bg-white/45' />
          <div className='absolute bottom-4 right-4 h-10 w-14 rounded-[999px] border border-white/70 bg-white/35' />
          <div className='absolute bottom-3 left-5 h-3 w-12 rounded-full bg-amber-100/75' />
          <div className='absolute bottom-6 left-10 h-3 w-8 rounded-full bg-emerald-100/75' />
          <div className='absolute bottom-4 left-3 h-8 w-5 rounded-full border border-white/60 bg-white/25' />
        </div>
      </div>

      <div>
        <h3 className='line-clamp-2 h-[2lh] w-full text-sm font-semibold text-slate-800'>
          {item.name}
        </h3>
        <p className='mt-2 font-bold text-emerald-600'>
          ${Number(item.salePrice).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
