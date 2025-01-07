import {createEventGroup} from "../lib/data";
import Link from "next/link";

export default function Page() {
    return (
        <>
            <h1>You are in Event Group Now</h1>
            <Link href="/event-groups/new">
                <button>
                    イベントグループを作成
                </button>
            </Link>
        </>);
}