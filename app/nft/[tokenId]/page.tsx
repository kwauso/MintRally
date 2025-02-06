import NFTDetail from './NFTDetail'

export default async function Page({ params }: { params: Promise<{ tokenId: string }> }) {
  return <NFTDetail tokenId={(await params).tokenId} />
} 