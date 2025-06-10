import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

function ResultScreen() {
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [points, setPoints] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    useEffect(() => {
        const startTime = parseInt(searchParams.get("startTime") || "0");

        if (startTime === 0) {
            setError("走行開始時間が記録されていません");
            return;
        }

        const endTime = Date.now();
        const durationInMinutes = Math.floor((endTime - startTime) / 60000);
        setDuration(durationInMinutes);

        // ポイント計算を時間のみにする
        const totalPoints = Math.floor(durationInMinutes * 10);
        setPoints(totalPoints);
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-[400px]">
                <h1 className="text-3xl font-bold mb-8 text-center font-roboto text-[#333333]">
                    走行結果
                </h1>

                {error ? (
                    <div className="text-center text-[#f44336] mb-6">{error}</div>
                ) : (
                    <div className="space-y-6">
                        {/* 距離の表示を削除 */}
                        <div className="text-center">
                            <p className="text-lg font-roboto text-[#666666]">経過時間</p>
                            <p className="text-4xl font-bold font-roboto text-[#2196F3]">
                                {duration} 分
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-roboto text-[#666666]">獲得ポイント</p>
                            <p className="text-4xl font-bold font-roboto text-[#FF9800]">
                                {points} pt
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-12">
                    <Link to="/">
                        <button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-4 px-8 rounded-lg text-xl font-roboto">
                            ホームに戻る
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResultScreen;