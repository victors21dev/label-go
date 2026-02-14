import { SignIn, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <>
      <SignedIn>
        {/* Se já está logado, vai pra home */}
        <meta httpEquiv="refresh" content="0; url=/" />
      </SignedIn>

      <SignedOut>
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/cadastro"
          afterSignInUrl="/"
          fallbackRedirectUrl="/"
        />
      </SignedOut>
    </>
  );
}
