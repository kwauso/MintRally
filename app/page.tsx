import Image from "next/image";
import mainImage from "../public/main.webp"
import feature1 from "../public/feature1.png"
import feature2 from "../public/feature2.png"
import feature3 from "../public/feature3.png"

export default function Page() {
    return (
        <>
            <Image 
                src={mainImage} 
                alt="Main Image" 
                layout="responsive" // レスポンシブに表示
            />
            <div className="image-container">
                <h1 style={{ textAlign: "left", marginBottom: "20px", marginLeft: "0" }}>特徴</h1> {/* image-containerの上に配置 */}
            </div>
            <div className="image-container">
                <div className="image-item">
                    <Image 
                        src={feature1} 
                        alt="Main Image 1" 
                        layout="responsive" 
                        width={300} 
                        height={200} 
                    />
                    <p>大切なイベントに参加した記録を残すことができます</p>
                </div>
                <div className="image-item">
                    <Image 
                        src={feature2} 
                        alt="Main Image 2" 
                        layout="responsive" 
                        width={300} 
                        height={200} 
                    />
                    <p>繰り返し参加することで、特別なNFTを取得できます</p>
                </div>
                <div className="image-item">
                    <Image 
                        src={feature3} 
                        alt="Main Image 3" 
                        layout="responsive" 
                        width={300} 
                        height={200} 
                    />
                    <p>簡単なフォーム入力でNFTを配布しはじめられます</p>
                </div>
            </div>
            <div className="howto-container">
                <h1 style={{ textAlign: "left", marginBottom: "20px", marginLeft: "0" }}>使い方</h1>
            </div>
            <div className="howto-container">
                <div className="card-container">
                    <div className="card">
                        <p>数分で簡単に配布準備完了！<br></br>
                        イベント情報を入力してウォレットで署名するだけで、審査は不要です。</p>
                        <br></br>
                        <div className="small-square">
                            <p>主催者</p>
                        </div>
                    </div>
                    <div className="card">
                        <p>あいことばでNFTをGET！<br></br>
                        イベント主催者から教えてもらったあいことばを入力してNFTを手に入れることができます！</p>
                        <br></br>
                        <div className="small-square">
                            <p>参加者</p>
                        </div>
                    </div>
                    <div className="card">
                        <p>たくさん参加しよう！<br></br>
                        何度も参加することでもらえる特別なNFTをMintして、また参加したくなるイベントをつくろう！</p>
                        <br></br>
                        <div className="small-square">
                            <p>主催者&参加者</p>
                        </div>
                    </div>
                </div>
            </div>
        </>);
}

//<Link href={"/events"}>Event</Link>