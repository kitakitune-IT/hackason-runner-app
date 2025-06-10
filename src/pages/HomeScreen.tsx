import { Link } from 'react-router-dom';
// ▼▼▼【修正点1】src/imagesにある画像をインポートする ▼▼▼
import windowImage from '../images/車窓.jpg';

function HomeScreen() {
  // ▼▼▼【修正点2】インポートした画像を変数としてスタイルに適用する ▼▼▼
  const backgroundStyle = {
    backgroundImage: `url(${windowImage})`,
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 relative"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 font-mincho text-white drop-shadow-lg">
          こころの車窓から
        </h1>
        
        {/* ▼▼▼【修正点3】英語のサブタイトル<p>タグを削除 ▼▼▼ */}
        
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link to="/running" className="w-full">
            <button className="w-full bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 text-white font-bold py-4 px-8 rounded-xl text-2xl font-roboto transition-all hover:bg-opacity-30">
              走行開始
            </button>
          </Link>

          <div className="grid grid-cols-3 gap-3 w-full mt-4">
            <Link to="/shop">
              <button className="w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white font-bold py-3 px-4 rounded-lg text-base font-roboto transition-all hover:bg-opacity-20">
                ショップ
              </button>
            </Link>
            <Link to="/workshop">
              <button className="w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white font-bold py-3 px-4 rounded-lg text-base font-roboto transition-all hover:bg-opacity-20">
                ワークショップ
              </button>
            </Link>
            <Link to="/record">
              <button className="w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white font-bold py-3 px-4 rounded-lg text-base font-roboto transition-all hover:bg-opacity-20">
                記録
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;