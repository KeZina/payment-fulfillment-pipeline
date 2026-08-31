import { WithChildren } from "@/types";

export default function Layout({ children }: WithChildren) {
  return <div className='mt-16 flex justify-center'>{children}</div>;
}
