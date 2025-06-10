import { useState } from 'react';
import { Link } from 'react-router-dom';

// Recordの型定義からdistanceを削除
interface Record {
    date: string;
    points: number;
    duration: number;
}

function RecordScreen() {
    // データからもdistanceを削除
    const [records] = useState<Record[]>([
        { date: "2025/01/15", points: 520, duration: 45 },
        { date: "2025/01/14", points: 380, duration: 30 },
        { date: "2025/01/12", points: 450, duration: 40 },
    ]);

    const totalPoints = records.reduce((sum, record) => sum + record.points, 0);

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold my-8 font-roboto text-[#333333]">
                運動記録
            </h1>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-[600px] mb-8">
                {/* 総走行距離の表示を削除 */}
                <div className="grid grid-cols-1 gap-4 mb-8 text-center">
                    <div>
                        <p className="text-lg font-roboto text-[#666666]">現在のポイント</p>
                        <p className="text-3xl font-bold font-roboto text-[#FF9800]">
                            {totalPoints} pt
                        </p>
                    </div>
                </div>
                <div className="space-y-4">
                    {records.map((record, index) => (
                        <div key={index} className="bg-[#f8f8f8] rounded-lg p-4">
                            <div className="flex flex-wrap justify-between items-center gap-2">
                                <div className="font-roboto text-lg text-[#333333]">{record.date}</div>
                                <div className="flex gap-4 text-sm sm:text-base">
                                    {/* 距離の表示を削除 */}
                                    <span className="font-roboto text-[#2196F3]">{record.points} pt</span>
                                    <span className="font-roboto text-[#666666]">{record.duration} 分</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Link to="/" className='w-full max-w-[600px]'>
                 <button className="w-full bg-[#9C27B0] hover:bg-[#7B1FA2] text-white font-bold py-4 px-8 rounded-lg text-xl font-roboto">
                    ホームに戻る
                </button>
            </Link>
        </div>
    );
}

export default RecordScreen;