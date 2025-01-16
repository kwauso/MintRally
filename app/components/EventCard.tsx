import Link from 'next/link';

interface EventCardProps {
    event: {
        id: number;
        name: string;
        description: string;
        date: string;
        creator_address: string;
        nftEnabled: boolean;
    };
}

export default function EventCard({ event }: EventCardProps) {
    return (
        <Link href={`/event/${event.id}`} className="block w-full">
            <div className="card bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 h-full flex flex-col mx-auto max-w-md">
                <div className="flex-1">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 line-clamp-2 flex-grow">
                            {event.name}
                        </h2>
                        {event.nftEnabled && (
                            <span className="small-square bg-[#56F0DE] text-black">
                                NFT対応
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                        {event.description || 'イベントの説明はありません'}
                    </p>
                    <div className="space-y-3 text-sm text-gray-500 border-t pt-4">
                        <div className="flex items-center gap-3">
                            <span>開催日時：</span>
                            <span>
                                {new Date(event.date).toLocaleString('ja-JP', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span>作成者：</span>
                            <span className="truncate" title={event.creator_address}>
                                {event.creator_address.slice(0, 6)}...{event.creator_address.slice(-4)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
} 