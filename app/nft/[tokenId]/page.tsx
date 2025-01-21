import NFTDetail from './NFTDetail'

export default function Page({ params }: { params: { tokenId: string } }) {
  return <NFTDetail tokenId={params.tokenId} />
} 