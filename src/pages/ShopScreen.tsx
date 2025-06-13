import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';
import { availableCharacters } from '../data/characterData';
import type { Character } from '../data/characterData';
// ▼▼▼【新規】背景画像をインポート ▼▼▼
import backgroundImage from '../images/ショップ.avif';

function ShopScreen() {
  const { points, unlockedCharacterIds, purchaseCharacter, tutorialStep, setTutorialStep } = useCharacterContext();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const shopCharacters = availableCharacters.map(char => ({ ...char, price: char.price || 0 }));

  const handlePurchase = (character: Character) => {
    const success = purchaseCharacter(character);
    if (success) {
      setMessage(`${character.name}をアンロックしました！`);
      if (tutorialStep === 1 && character.id === 1) {
        setTutorialStep(2);
      }
    } else {
      setMessage("ポイントが足りません。");
    }
  };

  const getCardClass = (charId: number) => {
    return tutorialStep === 1 && charId === 1 ? 'animate-pulse ring-4 ring-blue-500' : '';
  };

  const handleNavigateHome = () => {
    navigate('/');
  };
  
  // ▼▼▼【新規】背景用のstyleオブジェクトを作成 ▼▼▼
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`
  };

  return (
    // ▼▼▼【変更】背景画像とオーバーレイを適用 ▼▼▼
    <div className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center p-4" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
      
      {/* コンテンツ全体をラッパーで囲い、z-indexを適用 */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {tutorialStep === 1 && (
          <div className="bg-white shadow-lg rounded-lg p-4 my-4 border-2 border-blue-500">
            <p className="text-center font-bold text-blue-600">まずは「nyan cat」をアンロックしてみましょう！</p>
          </div>
        )}
        {tutorialStep === 2 && (
          <div className="bg-white shadow-lg rounded-lg p-4 my-4 border-2 border-green-500">
            <p className="text-center font-bold text-green-600">nyan catがアンロックされました！<br/>下のボタンを押してホーム画面に戻りましょう。</p>
          </div>
        )}

        {/* ▼▼▼【変更】文字色を白に変更して可読性を確保 ▼▼▼ */}
        <h1 className="text-4xl font-bold font-mincho text-white drop-shadow-lg my-4">gifショップ</h1>
        <p className="text-xl font-roboto text-gray-200 mb-2 drop-shadow-md">所持ポイント: <span className="font-bold text-orange-400">{points} pt</span></p>
        <p className="text-center text-sm text-gray-300 mb-4 px-4 drop-shadow-md">現在はプレゼン用に、一時的に価格を低く設定しています。</p>
        {message && <p className="text-center text-green-300 bg-black bg-opacity-50 rounded-md py-2 px-4 mb-4">{message}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-4xl p-4">
          {shopCharacters.map((char) => (
            <div key={char.id} className={`border rounded-lg p-4 flex flex-col items-center justify-between transition-all bg-white shadow-sm ${getCardClass(char.id)}`}>
              <img src={char.imageSrc} alt={char.name} className="w-24 h-24 object-contain mb-2" />
              <div className='text-center w-full'>
                <p className="font-roboto text-lg font-semibold text-gray-800">{char.name}</p>
                <p className="text-sm text-gray-500 mb-2">{char.price} pt</p>
                <button 
                  onClick={() => handlePurchase(char)} 
                  disabled={unlockedCharacterIds.includes(char.id) || (tutorialStep === 1 && char.id !== 1)} 
                  className={`w-full font-bold py-2 px-4 rounded transition-colors text-white ${
                    unlockedCharacterIds.includes(char.id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : (tutorialStep === 1 && char.id !== 1)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {unlockedCharacterIds.includes(char.id) ? "購入済み" : "アンロック"}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleNavigateHome}
          disabled={tutorialStep === 1}
          className={`mt-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full text-lg font-roboto shadow-lg ${
            tutorialStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
}
export default ShopScreen;