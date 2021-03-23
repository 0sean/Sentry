import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

export default function Command({ command, prefix }) {
    const [toggled, setToggled] = useState(false);
    return <div className="flex p-8 bg-blend bg-opacity-30 rounded-xl mb-3">
        <div className="flex-grow">
            <h1 className="font-medium text-xl">{command.name}</h1>
            {toggled && command.aliases.length != 0 ? <p className="opacity-80">Aliases: {command.aliases.join(",")}</p> : null}
            <p>{command.description}</p>
            {command.format && toggled ? <p className="my-auto pr">Usage: <code className="font-mono p-1 bg-blend bg-opacity-50 rounded-md">{prefix}{command.name} {command.format}</code></p> : null}
        </div>
        {command.aliases.length != 0 || command.format != null ? <div className="my-auto px-5" onClick={() => { setToggled(!toggled); }}>
            {toggled ? <AiFillCaretUp size={24} /> : <AiFillCaretDown size={24} />}
        </div> : null}
    </div>;
}