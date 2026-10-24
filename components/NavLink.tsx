'use client';

import { usePathname } from "next/navigation";
import classNames from "classnames";
import Link from "next/link";

import type { LinkProps } from "next/link";

export const NavLink = ({ children, ...props }: LinkProps & { children: string }) => {
  const pathname = usePathname();

  const isActive = pathname === props.href;

  return (
    <Link
      className={classNames('py-2', isActive ? 'bg-white' : 'bg-red-100')}
      {...props}
    >
      {children}
    </Link>
  );
};