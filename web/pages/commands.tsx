import Head from "../components/Head";
import Navbar from "../components/Navbar";
import Command from "../components/Command";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import useSWR from "swr";
import Select from "react-select";

const fetcher = (url, serverside = false) => serverside ? fetch(`http://127.0.0.1:${process.env.WEB_PORT}${url}`).then(r => r.json()) : fetch(url).then(r => r.json());

export default function Home({ initialData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data } = useSWR("/api/commands", fetcher, {initialData});
    
    return <>
        <Head title="Commands" />
        <div className="flex h-screen bg-notquiteblack">
            <Navbar />
            <div className="px-24 py-32 text-white w-full">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-6xl font-semibold pb-2">Commands</h1>
                        <p className="pb-3">Prefix all commands with <code className="font-mono p-1 bg-blend bg-opacity-50 rounded-md">{data.prefix}</code>.</p>
                    </div>
                    <div>
                        <p className="text-right pb-1">Filter by role</p>
                        <Select options={[{value: -1, label: "All"}, {value: 0, label: "Member"}, {value: 1, label: "Moderator"}, {value: 2, label: "Admin"}, {value: 3, label: "Server Owner"}, {value: 4, label: "Bot Owner"}]} theme={theme => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: "#FF474A",
                                primary25: "rgba(9,10,11, 0.3)",
                                neutral0: "#1A1E20",
                                neutral20: "#FF474A",
                                neutral80: "white"
                            }
                        })} className="text-white w-40" />
                    </div>
                </div>
                {data.commands.map(command => 
                    <Command command={command} prefix={data.prefix} key={command.name} />
                )}
            </div>
        </div>
    </>;
}

export const getServerSideProps: GetServerSideProps = async () => {
    const initialData = await fetcher("/api/commands", true);
    return {props: {initialData}};
};