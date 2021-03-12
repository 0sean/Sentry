import { CommandClient } from "detritus-client";

interface Event {
    name: string
    trigger: (data: unknown, client: CommandClient) => void
}

const Events: Event[] = [];

export default Events;