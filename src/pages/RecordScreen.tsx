import { Link } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';
// ▼▼▼【新規】背景画像をインポート ▼▼▼
import backgroundImage from '../images/汽車.jpg';

function RecordScreen() {
    const { records, totalRunDuration, totalAccumulatedPoints, clearRecords } = useCharacterContext();

    const handleClearRecords = () => {
        if (window.confirm('本当にすべての走行記録を消去しますか？\n（累計データや所持ポイントは消えません）')) {
            clearRecords();
        }
    };
    
    // ▼▼▼【新規】背景用のstyleオブジェクトを作成 ▼▼▼
    const backgroundStyle = {
      backgroundImage: `url(${backgroundImage})`
    };

    return (
        // ▼▼▼【変更】背景画像とオーバーレイを適用 ▼▼▼
        <div className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center p-4" style={backgroundStyle}>
            <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
            
            {/* コンテンツ全体をラッパーで囲い、z-indexを適用 */}
            <div className="relative z-10 flex flex-col items-center w-full">
                <div className='w-full max-w-[600px] flex justify-between items-center my-8'>
                    <h1 className="text-3xl font-bold font-roboto text-white drop-shadow-lg">走行記録</h1>
                    <button 
                        onClick={handleClearRecords}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-lg"
                    >
                        記録を消去
                    </button>
                </div>
                
                {/* ▼▼▼【変更】ガラス風UIに変更し、文字色を調整 ▼▼▼ */}
                <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-lg shadow-lg p-6 w-full max-w-[600px] mb-8">
                    <div className="grid grid-cols-2 gap-4 mb-8 text-center">
                        <div>
                            <p className="text-lg font-roboto text-gray-300">累計走行時間</p>
                            <p className="text-3xl font-bold font-roboto text-green-300 drop-shadow-md">{totalRunDuration} 分</p>
                        </div>
                        <div>
                            <p className="text-lg font-roboto text-gray-300">累計獲得ポイント</p>
                            <p className="text-3xl font-bold font-roboto text-orange-300 drop-shadow-md">{totalAccumulatedPoints} pt</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {records.length === 0 ? (
                            <p className="text-center text-gray-400 py-8">まだ記録がありません。</p>
                        ) : (
                            records.map((record, index) => (
                                <div key={index} className="bg-black bg-opacity-20 rounded-lg p-4">
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                        <div className="font-roboto text-lg text-gray-200">{record.date}</div>
                                        <div className="flex gap-4 text-sm sm:text-base">
                                            <span className="font-roboto text-orange-300">{record.points} pt</span>
                                            <span className="font-roboto text-gray-300">{record.duration} 分</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <Link to="/" className='w-full max-w-[600px]'>
                    <button className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-bold py-4 px-8 rounded-lg text-xl font-roboto shadow-lg">ホームに戻る</button>
                </Link>
            </div>
        </div>
    );
}

export default RecordScreen;