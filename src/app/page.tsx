import { NavMenu } from "../components/nav";
import { Items } from "./_components/items";
import { NavContentContainer } from "./_components/nav-content-container";

export default async function Page() {
  return (
    <div>
      <NavMenu>
        <NavContentContainer />
      </NavMenu>
      <Items />
    </div>
  );
}
