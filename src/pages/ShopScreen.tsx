import { Link } from 'react-router-dom';

function ShopScreen() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold my-8 font-mincho text-[#333333] drop-shadow-sm">
        gifショップ
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
        {/* ▼▼▼ アバター画像を配置する場所（今は空） ▼▼▼ */}
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            (準備中)
          </div>
          <p className="mt-2 font-roboto text-lg text-center">gif 1</p>
          <button className="mt-2 bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-4 rounded-md text-sm font-roboto">
            購入
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            (準備中)
          </div>
          <p className="mt-2 font-roboto text-lg text-center">gif 2</p>
          <button className="mt-2 bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-4 rounded-md text-sm font-roboto">
            購入
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            (準備中)
          </div>
          <p className="mt-2 font-roboto text-lg text-center">gif 3</p>
          <button className="mt-2 bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-4 rounded-md text-sm font-roboto">
            購入
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            (準備中)
          </div>
          <p className="mt-2 font-roboto text-lg text-center">gif 4</p>
          <button className="mt-2 bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-4 rounded-md text-sm font-roboto">
            購入
          </button>
        </div>
        {/* ▲▲▲ 必要に応じて、このdiv要素を増やしてね ▲▲▲ */}
      </div>

      <Link to="/" className="mt-8">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full text-lg font-roboto">
          ホームに戻る
        </button>
      </Link>
    </div>
  );
}

export default ShopScreen;