import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';
// ▼▼▼【新規】背景画像をインポート ▼▼▼
import backgroundImage from '../images/無人駅.jpg';

function ResultScreen() {
    const [searchParams] = useSearchParams();
    const { addRecord } = useCharacterContext();
    const [error, setError] = useState<string | null>(null);
    const [points, setPoints] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === false) {
            const startTime = parseInt(searchParams.get("startTime") || "0");
            if (startTime === 0) {
                setError("走行開始時間が記録されていません");
                return;
            }
            const endTime = Date.now();
            const durationInMinutes = Math.floor((endTime - startTime) / 60000);
            setDuration(durationInMinutes);
            const totalPoints = Math.floor(durationInMinutes * 10);
            setPoints(totalPoints);
            if (durationInMinutes > 0) {
                const newRecord = {
                    date: new Date().toLocaleDateString('ja-JP'),
                    duration: durationInMinutes,
                    points: totalPoints,
                };
                addRecord(newRecord);
            }
            effectRan.current = true;
        }
    }, [searchParams, addRecord]);

    // ▼▼▼【新規】背景用のstyleオブジェクトを作成 ▼▼▼
    const backgroundStyle = {
      backgroundImage: `url(${backgroundImage})`
    };

    return (
        // ▼▼▼【変更】背景画像とオーバーレイを適用 ▼▼▼
        <div className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center justify-center p-4" style={backgroundStyle}>
            <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
            
            {/* ▼▼▼【変更】ガラス風UIに変更し、文字色を白に ▼▼▼ */}
            <div className="relative z-10 bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 rounded-lg shadow-lg p-8 w-full max-w-[400px]">
                <h1 className="text-3xl font-bold mb-8 text-center font-roboto text-white drop-shadow-lg">
                    走行結果
                </h1>
                {error ? (
                    <div className="text-center text-red-300 mb-6">{error}</div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-lg font-roboto text-gray-200">経過時間</p>
                            <p className="text-4xl font-bold font-roboto text-white drop-shadow-md">{duration} 分</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-roboto text-gray-200">獲得ポイント</p>
                            <p className="text-4xl font-bold font-roboto text-orange-400 drop-shadow-md">{points} pt</p>
                        </div>
                    </div>
                )}
                <div className="mt-12">
                    <Link to="/">
                        <button className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-bold py-4 px-8 rounded-lg text-xl font-roboto">
                            ホームに戻る
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default ResultScreen;