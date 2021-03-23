import Head from "../components/Head";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import useSWR from "swr";

const fetcher = (url, serverside = false) => serverside ? fetch(`http://127.0.0.1:${process.env.WEB_PORT}${url}`).then(r => r.json()) : fetch(url).then(r => r.json());

export default function Home({ initialData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data } = useSWR("/api/stats", fetcher, {initialData});
    
    return <>
        <Head />
        <div className="flex h-screen bg-notquiteblack">
            <Navbar />
            <div className="m-auto text-white">
                <h1 className="text-6xl font-semibold whitespace-pre">Moderate with ease.</h1>
                <p className="text-lg pb-4">Sentry is a Discord bot focused on easy moderation.</p>
                <Button label="Get started" />
            </div>
            <div className="m-auto text-center text-white">
                <div className="pb-4">
                    <h1 className="text-2xl pb-2">{data.servers || "???"}</h1>
                    <p>server{data.servers > 1 ? "s" : ""} using Sentry</p>
                </div>
                <div>
                    <h1 className="text-2xl pb-2">{data.users || "???"}</h1>
                    <p>user{data.users > 1 ? "s" : ""} using Sentry</p>
                </div>
            </div>
        </div>
    </>;
}

export const getServerSideProps: GetServerSideProps = async () => {
    const initialData = await fetcher("/api/stats", true);
    return {props: {initialData}};
};