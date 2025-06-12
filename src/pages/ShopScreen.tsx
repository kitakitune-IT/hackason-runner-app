import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';
import { availableCharacters } from '../data/characterData';
import type { Character } from '../data/characterData';

function ShopScreen() {
  const { points, unlockedCharacterIds, purchaseCharacter } = useCharacterContext();
  const [message, setMessage] = useState('');

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