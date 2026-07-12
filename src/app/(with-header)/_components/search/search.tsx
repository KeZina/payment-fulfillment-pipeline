import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function Search() {
  return (
    <InputGroup className='w-xl max-w-xl'>
      <InputGroupInput placeholder='Search...' />
      <InputGroupAddon>
        <HugeiconsIcon
          icon={SearchIcon}
          size={24}
          color='currentColor'
          strokeWidth={1.5}
        />
      </InputGroupAddon>
      <InputGroupAddon align='inline-end'>69 results</InputGroupAddon>
    </InputGroup>
  );
}
