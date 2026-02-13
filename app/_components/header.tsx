import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
};

const Header = ({ children }: HeaderProps) => {
  return (
    <div className="flex w-full justify-between items-center">
      <div>{children}</div>
      <div>
        <UserButton showName />
      </div>
    </div>
  );
};

export default Header;
