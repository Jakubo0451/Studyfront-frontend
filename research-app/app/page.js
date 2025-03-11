import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Create studies, conduct research</h1>
      <Link href="./login/">Log in</Link>
      <Link href="./signup/">Sign Up</Link>
    </div>
  );
}
