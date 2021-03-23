import Head from "../components/Head";
import DashboardNavbar from "../components/DashboardNavbar";
import { useState } from "react";
import { BiSelectMultiple } from "react-icons/bi";
import { GetServerSideProps } from "next";
import { Request } from "express-serve-static-core";
import useSWR from "swr";
import { BsFillShieldFill, BsFillChatSquareDotsFill } from "react-icons/bs";
import Tooltip from "react-tooltip";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Button from "../components/Button";
import {inspect} from "util";

const fetcher = url => fetch(url).then(r => r.json());

export default function Dashboard({user, domain}) {
    const [selectedServer, setServer] = useState(null),
        [selectedTab, setTab] = useState(0),
        { data } = useSWR(["/api/guilds", user.id], fetcher, {initialData: {guilds: []}, refreshInterval: 0, revalidateOnMount: true});
    useEffect(() => {
        setTab(0);
    }, [selectedServer]);
    return <>
        <Head />
        <div className="flex flex-col h-screen bg-notquiteblack">
            <DashboardNavbar user={user} servers={data.guilds} setServer={setServer} />
            {selectedServer && <div className="flex p-6 justify-center text-white bg-blend bg-opacity-20">
                <BsFillShieldFill data-tip data-for="security" size={24} className={selectedTab == 1 ? "mr-3 fill-current text-sentryred transition-colors" : "mr-3 fill-current hover:text-sentryred transition-colors"} onClick={() => { setTab(1); }}/>
                <Tooltip place="bottom" effect="solid" id="security">
                    <span>Security & Permissions</span>
                </Tooltip>
                <BsFillChatSquareDotsFill data-tip data-for="chat" size={24} className={selectedTab == 2 ? "ml-3 fill-current text-sentryred transition-colors" : "ml-3 fill-current hover:text-sentryred transition-colors"} onClick={() => { setTab(2); }}/>
                <Tooltip place="bottom" effect="solid" id="chat">
                    <span>Chat</span>
                </Tooltip>
            </div>}
            <div className={!selectedServer || selectedTab == 0 ? "text-white m-auto" : "mx-auto text-white"}>
                {selectedServer ? selectedTab == 0 ? <div>
                    <BiSelectMultiple color="grey" size={64} className="mx-auto mb-3"/>
                    <p className="text-gray-400">Select a tab at the top.</p>
                </div> : selectedTab == 1 ? <SecurityTab server={selectedServer} domain={domain} /> : selectedTab == 2 ? <ChatTab server={selectedServer} domain={domain} /> : null : <div>
                    <BiSelectMultiple color="grey" size={64} className="mx-auto mb-3"/>
                    <p className="text-gray-400">Select a server from the dropdown at the top.</p>
                </div>}
            </div>
        </div>
    </>;
}

function SecurityTab({server, domain}) {
    const [verifyEnabled, setVerifyEnabled] = useState(false),
        [modRole, setModRole] = useState(undefined),
        [adminRole, setAdminRole] = useState(undefined),
        [verifyRole, setVerifyRole] = useState(undefined),
        { data } = useSWR([`/api/settings?guildID=${server.value}`, server.value], fetcher, {initialData: {moderatorRole: {value: "", label: ""}, adminRole: {value: "", label: ""}, verifyEnabled: false, verifyRole: {value: "", label: ""}, roles: []}, revalidateOnMount: true, onSuccess: (data) => {
            setVerifyEnabled(data.verifyEnabled);
            setModRole(data.moderatorRole);
            setAdminRole(data.adminRole);
            setVerifyRole(data.verifyRole);
        }});
    return <div className="flex flex-col p-8">
        <h1 className="text-2xl font-semibold underline pb-3 text-center">Security & Permissions</h1>
        <div className="inline-block static bg-blend bg-opacity-30 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-medium">Moderator role</h2>
            <p className="pb-2">This role has access to all of Sentry&apos;s moderation commands.</p>
            <Select options={data.allRoles} isClearable={true} value={modRole} theme={theme => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: "#FF474A",
                    primary25: "rgba(9,10,11, 0.3)",
                    neutral0: "#1A1E20",
                    neutral20: "#FF474A",
                    neutral80: "white"
                }
            })} className="text-white" onChange={r => { setModRole(r); }} />
        </div>
        <br/>
        <div className="inline-block static bg-blend bg-opacity-30 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-medium">Admin role</h2>
            <p className="pb-2">This role inherits all moderator permissions, but can also access the dashboard.</p>
            <Select options={data.allRoles} isClearable={true} value={adminRole} theme={theme => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: "#FF474A",
                    primary25: "rgba(9,10,11, 0.3)",
                    neutral0: "#1A1E20",
                    neutral20: "#FF474A",
                    neutral80: "white"
                }
            })} className="text-white" onChange={r => { setAdminRole(r); }} />
        </div>
        <br/>
        <div className="inline-block static bg-blend bg-opacity-30 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-medium">Verify</h2>
            <p className="pb-2">Verify is Sentry&apos;s bot and ban evasion protection.<br/>It requires new members to go through a captcha and VPN check before they can chat in the server.</p>
            <input type="checkbox" id="verifyEnable" className="rounded selected:bg-sentryred focus:ring-transparent focus:ring-offset-0 transition-colors mr-1" checked={verifyEnabled} onClick={() => { setVerifyEnabled(!verifyEnabled); }} />
            <label htmlFor="verifyEnable">Enable Verify</label>
            {verifyEnabled && <><p className="font-medium">Verified members role:</p><Select options={data.allRoles} isClearable={true} value={verifyRole} theme={theme => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: "#FF474A",
                    primary25: "rgba(9,10,11, 0.3)",
                    neutral0: "#1A1E20",
                    neutral20: "#FF474A",
                    neutral80: "white"
                }
            })} className="text-white mt-1" onChange={r => { setVerifyRole(r); }} /></>}
        </div>
        <br/>
        <div className="inline-block static bg-blend bg-opacity-30 p-4 rounded-lg mb-4">
            <Button label="Save changes" onClick={() => {
                fetch(`${domain}api/settings`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                    moderatorRole: modRole,
                    adminRole: adminRole,
                    verifyEnabled,
                    verifyRole: verifyRole,
                    guildID: server.value
                })});
            }}></Button>
        </div>
    </div>;
}

function ChatTab({server, domain}) {
    const [spamFilterEnabled, setSpamFilterEnabled] = useState(false),
        [blockedTermsEnabled, setBlockedTermsEnabled] = useState(false),
        [blockedTerms, setBlockedTerms] = useState([]),
        [joinLeaveEnabled, setJoinLeaveEnabled] = useState(false),
        [joinLeaveChannel, setJoinLeaveChannel] = useState(undefined),
        [staffNotificationsEnabled, setStaffNotificationsEnabled] = useState(false),
        [staffNotificationsChannel, setStaffNotificationsChannel] = useState(undefined),
        { data } = useSWR([`/api/settings?guildID=${server.value}`, server.value], fetcher, {initialData: {spamFilterEnabled: false, blockedTermsEnabled: false, blockedTerms: [], joinLeaveEnabled: false, joinLeaveChannel: {value: "", label: ""}, staffNotificationsEnabled: false, staffNotificationsChannel: {value: "", label: ""}, allChannels: []}, revalidateOnMount: true, onSuccess: (data) => {
            setSpamFilterEnabled(data.spamFilterEnabled);
            setBlockedTermsEnabled(data.blockedTermsEnabled);
            setBlockedTerms(data.blockedTerms);
            setJoinLeaveEnabled(data.joinLeaveEnabled);
            setJoinLeaveChannel(data.joinLeaveChannel);
            setStaffNotificationsEnabled(data.staffNotificationsEnabled);
            setStaffNotificationsChannel(data.staffNotificationsChannel);
        }});
    return <div className="flex flex-col p-8">
        <h1 className="text-2xl font-semibold underline pb-3 text-center">Chat</h1>
        <div className="inline-block static bg-blend bg-opacity-30 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-medium">Filters</h2>
            <p>Use filters to control your chat and remove rule-breaking messages automatically.</p>
            <input type="checkbox" id="spamEnable" className="rounded selected:bg-sentryred focus:ring-transparent focus:ring-offset-0 transition-colors mr-1" checked={spamFilterEnabled} onClick={() => { setSpamFilterEnabled(!spamFilterEnabled); }} />
            <label htmlFor="spamEnable">Enable spam filter</label>
            <br/>
            <input type="checkbox" id="blockedtermsEnable" className="rounded selected:bg-sentryred focus:ring-transparent focus:ring-offset-0 transition-colors mr-1" checked={blockedTermsEnabled} onClick={() => { setBlockedTermsEnabled(!blockedTermsEnabled); }} />
            <label htmlFor="blockedtermsEnable">Enable blocked terms filter</label>
            {blockedTermsEnabled && <>
                <p className="font-medium">Blocked terms:</p>
                <CreatableSelect isMulti isClearable={true} value={blockedTerms} theme={theme => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: "#FF474A",
                        primary25: "rgba(9,10,11, 0.3)",
                        neutral0: "#1A1E20",
                        neutral20: "#FF474A",
                        neutral80: "white",
                        neutral10: "#FF474A"
                    }
                })} className="text-white" onChange={b => { setBlockedTerms(b); }} />
            </>}
        </div>
        <br/>
        <div className="inline-block static bg-blend bg-opacity-30 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-medium">Join/leave messages</h2>
            <p>Sends a message to chat whenever a member joins or leaves your server.</p>
            <input type="checkbox" id="joinleaveEnable" className="rounded selected:bg-sentryred focus:ring-transparent focus:ring-offset-0 transition-colors mr-1" checked={joinLeaveEnabled} onClick={() => { setJoinLeaveEnabled(!joinLeaveEnabled); }} />
            <label htmlFor="joinleaveEnable">Enable join leave messages</label>
            {joinLeaveEnabled && <>
                <p className="font-medium">Channel to send join/leave messages to:</p>
                <Select options={data.allChannels} isClearable={true} value={joinLeaveChannel} theme={theme => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: "#FF474A",
                        primary25: "rgba(9,10,11, 0.3)",
                        neutral0: "#1A1E20",
                        neutral20: "#FF474A",
                        neutral80: "white"
                    }
                })} className="text-white" onChange={c => { setJoinLeaveChannel(c); }} />
            </>}
        </div>
        <div className="inline-block static bg-blend bg-opacity-30 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-medium">Staff notifications</h2>
            <p>Sends a message whenever a moderation action is taken.</p>
            <input type="checkbox" id="notificationsEnable" className="rounded selected:bg-sentryred focus:ring-transparent focus:ring-offset-0 transition-colors mr-1" checked={staffNotificationsEnabled} onClick={() => { setStaffNotificationsEnabled(!staffNotificationsEnabled); }} />
            <label htmlFor="notificationsEnable">Enable staff notifications</label>
            {staffNotificationsEnabled && <>
                <p className="font-medium">Channel to send staff notifications to:</p>
                <Select options={data.allChannels} isClearable={true} value={staffNotificationsChannel} theme={theme => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: "#FF474A",
                        primary25: "rgba(9,10,11, 0.3)",
                        neutral0: "#1A1E20",
                        neutral20: "#FF474A",
                        neutral80: "white"
                    }
                })} className="text-white" onChange={c => { setStaffNotificationsChannel(c); }} />
            </>}
        </div>
        <br/>
        <div className="inline-block static bg-blend bg-opacity-30 p-4 rounded-lg mb-4">
            <Button label="Save changes" onClick={() => {
                fetch(`${domain}api/settings`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                    spamFilterEnabled,
                    blockedTermsEnabled,
                    blockedTerms,
                    joinLeaveEnabled,
                    joinLeaveChannel,
                    staffNotificationsEnabled,
                    staffNotificationsChannel,
                    guildID: server.value
                })});
            }}></Button>
        </div>
    </div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const req = context.req as Request;
    return {props: {user: req.user, domain: process.env.WEB_DOMAIN}};
};