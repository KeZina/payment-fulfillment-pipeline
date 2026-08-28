import Image from "next/image";
import { AVATAR_NAV_DISPLAY_SIZE_PX } from "@/constants/avatar";
import { getUserInitials } from "@/utils/get-user-initials";
import { navUserAvatarStyles } from "./nav-user-avatar.styles";
import type { NavUserAvatarProps } from "./nav-user-avatar.types";

export function NavUserAvatar({ name, image }: NavUserAvatarProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt=''
        width={AVATAR_NAV_DISPLAY_SIZE_PX}
        height={AVATAR_NAV_DISPLAY_SIZE_PX}
        sizes={`${AVATAR_NAV_DISPLAY_SIZE_PX}px`}
        priority
        unoptimized
        className={navUserAvatarStyles.image}
      />
    );
  }

  return (
    <span className={navUserAvatarStyles.initials} aria-hidden='true'>
      {getUserInitials(name)}
    </span>
  );
}
