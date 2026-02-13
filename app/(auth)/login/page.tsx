import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

const LoginPage = () => {
  return (
    <div>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        {/* Show the sign-in and sign-up buttons when the user is signed out */}
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </header>
      <div>Login Page</div>
    </div>
  );
};

export default LoginPage;
