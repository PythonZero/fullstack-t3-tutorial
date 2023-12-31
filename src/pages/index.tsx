import {signIn, signOut, useSession} from "next-auth/react";
import Head from "next/head";
import {api} from "~/utils/api";
import {ReactNode} from "react";
import Link from "next/link";
import {Toaster} from "react-hot-toast";
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
    const hello = api.example.hello.useQuery({text: " and Welcome"});

    return (
        <>
            <Layout>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-2xl text-white">
                        {hello.data ? hello.data.greeting : "Loading tRPC query..."}
                    </p>
                    <AuthShowcase/>
                </div>
            </Layout>

        </>

    );
}

export function Layout({children}: { children: ReactNode }) {
    return (
        <>
            <Head>
                <title>Your Todo App!</title>
                <meta name="description" content="Your todo app, it works!"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main
                className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        Your <span className="text-[hsl(280,100%,70%)]">Todo</span> App!
                    </h1>
                    <div className="flex flex-col items-center gap-2">
                        {children}
                        <Analytics />
                    </div>
                </div>
            </main>
            <Toaster/>

        </>
    );
}

function AuthShowcase() {
    const {data: sessionData} = useSession();

    const {data: secretMessage} = api.example.getSecretMessage.useQuery(
        undefined, // no input
        {enabled: sessionData?.user !== undefined}
    );

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
                {sessionData && <span>Logged in as {sessionData.user?.email}</span>}
                {secretMessage && <span> - {secretMessage}</span>}
            </p>
            <TodoButton/>

            <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>
        </div>
    );
}


function TodoButton() {
    return (
        <p className="text-center text-2xl text-yellow-300">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <Link href={"/todo"}>Link to Todos</Link>
            </button>
        </p>
    )
}