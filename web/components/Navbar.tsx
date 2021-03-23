import Link from "next/link";
import Button from "./Button";

export default function Navbar() {
    return <div className="flex absolute bg-blend bg-opacity-30 p-4 w-screen justify-between">
        <Link href="/"><a className="hidden sm:block text-4xl align-middle text-sentryred font-noisywalk my-auto">Sentry</a></Link>
        <div className="flex">
            <Link href="/commands"><Button className="mr-4" secondary label="Commands"/></Link>
            <Link href="/login"><Button label="Login" /></Link>
        </div>
    </div>;
}