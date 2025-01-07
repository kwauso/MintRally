import Link from 'next/link'

export default function Page() {
    return (
        <div>
            <h1>You are in Events</h1>
            <Link href="/events/new">イベント作成</Link>
        </div>
    );
}
