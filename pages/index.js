// pages/index.js
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/next.svg';

export default function Home() {
    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome to our Next.js app!</p>
            <Link href="/about">Go to About Page</Link>
            <Image src={logo} alt="Logo" width={200} height={100} />
        </div>
    );
}
