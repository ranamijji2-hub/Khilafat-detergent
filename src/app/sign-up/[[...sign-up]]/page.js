import { SignUp } from '@clerk/nextjs';

export const metadata = {
  title: 'Create Account',
  description: 'Create your Khilafat Detergent account for faster checkout and order tracking.',
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <SignUp />
    </div>
  );
}
