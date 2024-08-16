import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/notes");

  return (
    <main className="flex flex-col h-screen items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="logo" width={150} height={150} />
        <span className="font-extrabold tracking-tight text-4xl lg:text-5xl">
          Welcome to AI Note Stream!
        </span>
      </div>

      <p className="text-center max-w-prose">
        {" "}
        An Intelligent Note taking app with AI integration, PineCone, Next js
        Shadecn UI, Clerk and more
      </p>

      <Button>
        <Link href="/notes">Open</Link>
      </Button>
      <a
        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          Deploy{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
          Instantly deploy your Next.js site to a shareable URL with Vercel.
        </p>
      </a>
    </main>
  );
}
