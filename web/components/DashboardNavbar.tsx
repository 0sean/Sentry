import Link from "next/link";
import Select from "react-select";
import { useRouter } from "next/router";
import { HiChevronDown } from "react-icons/hi";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

export default function DashboardNavbar({user, servers, setServer}) {
    const router = useRouter();
    return <div className="flex bg-blend bg-opacity-30 py-2 px-4 w-screen justify-between">
        <Link href="/"><a className="hidden sm:block text-4xl align-middle text-sentryred font-noisywalk my-auto">Sentry</a></Link>
        <div className="my-auto w-64">
            <Select options={servers} theme={theme => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: "#FF474A",
                    primary25: "rgba(9,10,11, 0.3)",
                    neutral0: "#1A1E20",
                    neutral20: "#FF474A",
                    neutral80: "white"
                }
            })} className="text-white" onChange={(value) => {
                setServer(value);
            }} />
        </div>
        <div className="flex text-white">
            <Menu menuButton={<MenuButton className="hover:text-sentryred transition-colors flex my-auto">{user.username} <HiChevronDown style={{margin: "auto", marginLeft: "0.125rem"}} /></MenuButton>} styles={{backgroundColor: "#1A1E20", borderTopLeftRadius: 0, borderTopRightRadius: 0, boxShadow: "none", color: "white"}}>
                <MenuItem styles={{hover: {backgroundColor: "#1A1E20", boxShadow: "none", color: "#FF474A"}}} onClick={() => {router.push("/logout");}}>Logout</MenuItem>
            </Menu>
        </div>
    </div>;
}