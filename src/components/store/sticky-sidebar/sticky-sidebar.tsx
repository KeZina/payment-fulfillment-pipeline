import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib";
import { stickySidebarStyles } from "./sticky-sidebar.styles";
import type {
  StickySidebarCardProps,
  StickySidebarFooterProps,
  StickySidebarHeaderProps,
  StickySidebarPinnedProps,
  StickySidebarProps,
  StickySidebarScrollAreaProps,
} from "./sticky-sidebar.types";

export function StickySidebar({ className, ...props }: StickySidebarProps) {
  return (
    <aside className={cn(stickySidebarStyles.root, className)} {...props} />
  );
}

export function StickySidebarCard({
  className,
  ...props
}: StickySidebarCardProps) {
  return (
    <Card className={cn(stickySidebarStyles.card, className)} {...props} />
  );
}

export function StickySidebarHeader({
  className,
  ...props
}: StickySidebarHeaderProps) {
  return (
    <CardHeader className={cn(stickySidebarStyles.header, className)} {...props} />
  );
}

export function StickySidebarScrollArea({
  className,
  ...props
}: StickySidebarScrollAreaProps) {
  return (
    <CardContent
      className={cn(stickySidebarStyles.scrollArea, className)}
      {...props}
    />
  );
}

export function StickySidebarPinned({
  className,
  ...props
}: StickySidebarPinnedProps) {
  return (
    <div className={cn(stickySidebarStyles.pinned, className)} {...props} />
  );
}

export function StickySidebarFooter({
  className,
  ...props
}: StickySidebarFooterProps) {
  return (
    <CardFooter className={cn(stickySidebarStyles.footer, className)} {...props} />
  );
}
