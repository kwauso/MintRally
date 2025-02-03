import NFTDetail from './NFTDetail'

export default function Page({ params }: { params: Promise<{ tokenId: string }> }) {
  return <NFTDetail tokenId={params.tokenId} />
} 