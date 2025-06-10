import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCharacterSlots } from '../contexts/CharacterContext';
import { availableCharacters } from '../data/characterData';
import type { Character } from '../data/characterData';

function WorkshopScreen() {
  const { slots, updateSlot } = useCharacterSlots();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const handleSlotClick = (index: number) => {
    setSelectedSlotIndex(index);
    setIsModalOpen(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (selectedSlotIndex !== null) {
      updateSlot(selectedSlotIndex, character);
    }
    setIsModalOpen(false);
    setSelectedSlotIndex(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold my-8 font-mincho text-[#333333]">スロット編成</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mb-8">
        <p className="text-center text-gray-600 mb-6">走行画面で使うキャラクターを4つのスロットにセットしてください。</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {slots.map((slotCharacter, index) => (
            <div key={index} onClick={() => handleSlotClick(index)} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
              <p className="font-bold text-gray-500 mb-2">スロット {index + 1}</p>
              {slotCharacter ? (
                <>
                  <img src={slotCharacter.imageSrc} alt={slotCharacter.name} className="w-24 h-24 mx-auto object-contain" />
                  <p className="mt-2 font-semibold">{slotCharacter.name}</p>
                </>
              ) : (
                <div className="w-24 h-24 mx-auto flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-400">空き</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Link to="/" className="w-full max-w-2xl">
        <button className="w-full bg-[#9C27B0] hover:bg-[#7B1FA2] text-white font-bold py-4 px-8 rounded-lg text-xl font-roboto">ホームに戻る</button>
      </Link>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">キャラクターを選択</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {availableCharacters.map((char) => (
                <div key={char.id} className="p-3 bg-gray-100 rounded-lg text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleCharacterSelect(char)}>
                  <img src={char.imageSrc} alt={char.name} className="w-full h-24 object-contain mb-2" />
                  <p className="font-semibold text-gray-700">{char.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkshopScreen;