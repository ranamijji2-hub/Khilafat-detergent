import { SignIn } from '@clerk/nextjs';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your Khilafat Detergent account to track orders and more.',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <SignIn />
    </div>
  );
}
