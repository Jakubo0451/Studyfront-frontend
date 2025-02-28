import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the app</h1>
      <Link href="/login">Log in</Link>
      <Link href="/singup">Sign Up</Link>
    </div>
  );
}
