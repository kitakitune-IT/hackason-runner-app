import { Link } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';

function RecordScreen() {
    // Contextから、表示に必要なすべてのデータを取得
    const { records, totalRunDuration, totalAccumulatedPoints, clearRecords } = useCharacterContext();

    const handleClearRecords = () => {
        // 誤操作防止の確認ダイアログ
        if (window.confirm('本当にすべての走行記録を消去しますか？\n（累計データや所持ポイントは消えません）')) {
            clearRecords();
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center p-4">
            <div className='w-full max-w-[600px] flex justify-between items-center my-8'>
                <h1 className="text-3xl font-bold font-roboto text-[#333333]">運動記録</h1>
                {/* ▼▼▼【新規】記録消去ボタン ▼▼▼ */}
                <button 
                    onClick={handleClearRecords}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
                >
                    記録を消去
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-[600px] mb-8">
                {/* ▼▼▼【修正】累計データを表示 ▼▼▼ */}
                <div className="grid grid-cols-2 gap-4 mb-8 text-center">
                    <div>
                        <p className="text-lg font-roboto text-[#666666]">累計走行時間</p>
                        <p className="text-3xl font-bold font-roboto text-[#4CAF50]">{totalRunDuration} 分</p>
                    </div>
                    <div>
                        <p className="text-lg font-roboto text-[#666666]">累計獲得ポイント</p>
                        <p className="text-3xl font-bold font-roboto text-[#FF9800]">{totalAccumulatedPoints} pt</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* ▼▼▼【修正】記録リストが空の場合の表示 ▼▼▼ */}
                    {records.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">まだ記録がありません。</p>
                    ) : (
                        records.map((record, index) => (
                            <div key={index} className="bg-[#f8f8f8] rounded-lg p-4">
                                <div className="flex flex-wrap justify-between items-center gap-2">
                                    <div className="font-roboto text-lg text-[#333333]">{record.date}</div>
                                    <div className="flex gap-4 text-sm sm:text-base">
                                        <span className="font-roboto text-[#2196F3]">{record.points} pt</span>
                                        <span className="font-roboto text-[#666666]">{record.duration} 分</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Link to="/" className='w-full max-w-[600px]'>
                 <button className="w-full bg-[#9C27B0] hover:bg-[#7B1FA2] text-white font-bold py-4 px-8 rounded-lg text-xl font-roboto">ホームに戻る</button>
            </Link>
        </div>
    );
}

export default RecordScreen;