import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  isActive: string;
}

export function ActiveLink({ children, isActive, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? isActive : "";

  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
}
