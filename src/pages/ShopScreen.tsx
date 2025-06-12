import { useState, useEffect } from 'react'; // useEffectを追加
import { Link, useNavigate } from 'react-router-dom'; // useNavigateを追加
import { useCharacterContext } from '../contexts/CharacterContext';
import { availableCharacters } from '../data/characterData';
import type { Character } from '../data/characterData';

function ShopScreen() {
  const navigate = useNavigate();
  const { points, unlockedCharacterIds, purchaseCharacter, tutorialStep, advanceTutorialStep } = useCharacterContext();
  const [message, setMessage] = useState('');

  // ▼▼▼【修正】チュートリアルの自動進行チェック ▼▼▼
  useEffect(() => {
    // もし、チュートリアル段階が「1」で、かつ、ID:1のミームが既に購入済みなら、自動で次の段階へ
    if (tutorialStep === 1 && unlockedCharacterIds.includes(1)) {
      advanceTutorialStep();
    }
  }, [tutorialStep, unlockedCharacterIds, advanceTutorialStep]);

// 変更後（データファイルに書かれた、そのままの価格を使う）
  const shopCharacters = availableCharacters;

  const handlePurchase = (character: Character) => {
    if (unlockedCharacterIds.includes(character.id)) {
      setMessage("このgifは購入済みです。");
      return;
    }
    
    const success = purchaseCharacter(character);
    if (success) {
      setMessage(`${character.name}をアンロックしました！`);
    } else {
      setMessage("ポイントが足りません。");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center p-4">
       {/* ... */}
       {/* ▼▼▼【修正】チュートリアルメッセージの表示条件を、新しい流れに修正 ▼▼▼ */}
       {tutorialStep === 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 pointer-events-none">
           <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs mx-auto"><p className="text-gray-800 text-lg text-center font-bold">まずは、練習用に「ミーム」をアンロックしてみましょう！</p></div>
        </div>
      )}
      {tutorialStep === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 text-white text-2xl p-8 text-center animate-pulse" onClick={() => { advanceTutorialStep(); navigate('/'); }}>
          <p>よくできました！<br/>次は、ホーム画面に戻りましょう。<br/>（このメッセージをタップ）</p>
        </div>
      )}
      <h1 className="text-3xl font-bold my-4 font-mincho text-[#333333]">gifショップ</h1>
      <p className="text-lg font-roboto text-gray-600 mb-2">所持ポイント: <span className="font-bold text-orange-500">{points} pt</span></p>
      
      {/* ▼▼▼【新規】注意書きを追加 ▼▼▼ */}
      <p className="text-center text-sm text-red-600 my-4 px-4">
        現在はプレゼン用に、一時的に価格を低くしています。
      </p>

      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-4xl p-4 bg-white rounded-lg shadow">
        {shopCharacters.map((char) => (
          <div key={char.id} className="border rounded-lg p-4 flex flex-col items-center justify-between">
            <img src={char.imageSrc} alt={char.name} className="w-24 h-24 object-contain mb-2" />
            <div className='text-center'>
              <p className="font-roboto text-lg font-semibold">{char.name}</p>
              <p className="text-sm text-gray-500 mb-2">{char.price} pt</p>
              <button 
                onClick={() => handlePurchase(char)}
                disabled={unlockedCharacterIds.includes(char.id)}
                className={`w-full font-bold py-2 px-4 rounded-md text-sm font-roboto transition-colors ${
                  unlockedCharacterIds.includes(char.id)
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {unlockedCharacterIds.includes(char.id) ? "購入済み" : "アンロック"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className="mt-8">
        <button className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full text-lg font-roboto">
          ホームに戻る
        </button>
      </Link>
    </div>
  );
}

export default ShopScreen;