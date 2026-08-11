import Image from "next/image";
import { signInCopy } from "@/lib/mock/signin";

export function SignInHeader() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Image
        src="/kinetic-logo.png"
        alt={signInCopy.logoAlt}
        width={220}
        height={64}
        className="mb-2 h-16 w-auto"
        priority
      />
      <p className="font-body-md text-body-md text-on-surface-variant">
        {signInCopy.subtitle}
      </p>
    </div>
  );
}
