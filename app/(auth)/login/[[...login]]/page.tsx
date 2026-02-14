import { SignIn, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <>
      <SignedIn>
        <RedirectToSignIn redirectUrl="/" />
      </SignedIn>

      <SignedOut>
        <SignIn
          path="/login"
          routing="path"
          afterSignInUrl="/"
          fallbackRedirectUrl="/"
        />
      </SignedOut>
    </>
  );
}
