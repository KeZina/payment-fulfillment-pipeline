import { getSession } from "@/utils/server";
import { NavContent } from "../nav-content";

export async function NavContentContainer() {
  const session = await getSession();

  return <NavContent session={session} />;
}
