import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';
import { availableCharacters } from '../data/characterData';
import type { Character } from '../data/characterData';

function WorkshopScreen() {
  const { slots, updateSlot, unlockedCharacterIds, tutorialStep, setTutorialStep, customCharacters, addCustomCharacter, deleteCustomCharacter } = useCharacterContext();
  
  // ▼▼▼【修正】リンターの誤検知を抑制するコメントを追加 ▼▼▼
  // isModalOpen, selectedSlotIndexはJSX内やイベントハンドラ内で使用されています。
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  
  const [newCharName, setNewCharName] = useState('');
  const [newCharFile, setNewCharFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectableCharacters = [
    ...availableCharacters.filter(char => unlockedCharacterIds.includes(char.id)),
    ...customCharacters
  ];

  const handleSlotClick = (index: number) => {
    if (tutorialStep === 3 && index !== 0) {
      setMessage("今は「スロット1」にキャラクターをセットしましょう。");
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setSelectedSlotIndex(index);
    setIsModalOpen(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (selectedSlotIndex !== null) {
      updateSlot(selectedSlotIndex, character);
      if (tutorialStep === 3 && selectedSlotIndex === 0) {
        setTutorialStep(4);
      }
    }
    setIsModalOpen(false);
    setSelectedSlotIndex(null);
  };
  
  const handleEmptySlot = () => {
    if (tutorialStep === 3) return;
    
    if (selectedSlotIndex !== null) {
      updateSlot(selectedSlotIndex, null);
    }
    setIsModalOpen(false);
    setSelectedSlotIndex(null);
  };
  
  const getSlotClass = (index: number) => {
    return tutorialStep === 3 && index === 0 ? 'animate-pulse ring-4 ring-blue-500' : '';
  };
  
  const handleCloseModal = () => {
    if (tutorialStep === 3) return;
    setIsModalOpen(false);
  }

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'image/gif') {
        setMessage('GIF画像のみアップロードできます。');
        return;
      }
      setNewCharFile(file);
      setMessage(`ファイル選択OK: ${file.name}`);
    }
  };

  const handleUpload = async () => {
    if (!newCharName.trim()) {
      setMessage('キャラクターの名前を入力してください。');
      return;
    }
    if (!newCharFile) {
      setMessage('GIFファイルを選択してください。');
      return;
    }
    try {
      await addCustomCharacter(newCharName, newCharFile);
      setMessage(`「${newCharName}」を追加しました！`);
      setNewCharName('');
      setNewCharFile(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setMessage('キャラクターの追加に失敗しました。');
      console.error(error);
    }
  };
  
  const handleDelete = async (charToDelete: Character) => {
    if (window.confirm(`本当に「${charToDelete.name}」を削除しますか？`)) {
        try {
            await deleteCustomCharacter(charToDelete.id);
            setMessage(`「${charToDelete.name}」を削除しました。`);
        } catch (error) {
            setMessage('キャラクターの削除に失敗しました。');
            console.error(error);
        }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center p-4">
      {tutorialStep === 3 && (
        <div className="bg-white shadow-lg rounded-lg p-4 my-4 border-2 border-blue-500 w-full max-w-2xl">
          <p className="text-center font-bold text-blue-600">「スロット1」をタップして、キャラクターをセットしましょう！</p>
        </div>
      )}

      {tutorialStep === 4 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div 
            className="bg-white rounded-lg shadow-xl p-8 max-w-xs mx-auto pointer-events-auto cursor-pointer"
            onClick={() => setTutorialStep(5)}
          >
            <p className="text-gray-800 text-lg text-center font-bold">
              これで、走行の準備は完了です！<br/>
              このアプリをお楽しみください！<br/>
              <span className="text-sm mt-4 block text-gray-600">(タップしてチュートリアルを終了)</span>
            </p>
          </div>
        </div>
      )}
      
      <h1 className="text-3xl font-bold my-8 font-mincho text-[#333333]">スロット編成</h1>
      {message && <p className="text-center text-red-500 mb-4 font-bold">{message}</p>}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mb-8">
        <p className="text-center text-gray-600 mb-6">走行画面で使うキャラクターを4つのスロットにセットしてください。</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {slots.map((slotCharacter, index) => (
            <div key={index} onClick={() => handleSlotClick(index)} className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${getSlotClass(index)}`}>
              <p className="font-bold text-gray-500 mb-2">スロット {index + 1}</p>
              {slotCharacter ? ( <><img src={slotCharacter.imageSrc} alt={slotCharacter.name} className="w-24 h-24 mx-auto object-contain" /><p className="mt-2 font-semibold">{slotCharacter.name}</p></> ) : ( <div className="w-24 h-24 mx-auto flex items-center justify-center bg-gray-100 rounded-md"><p className="text-gray-400">空き</p></div> )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">オリジナルキャラクターの追加</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input 
              type="text" 
              placeholder="キャラクター名" 
              value={newCharName}
              onChange={(e) => setNewCharName(e.target.value)}
              className="p-2 border rounded-md w-full sm:w-auto flex-grow"
            />
            <input 
              type="file" 
              accept="image/gif" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden"
            />
            <button 
              onClick={handleFileSelectClick}
              className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              GIFファイルを選択
            </button>
            <button 
              onClick={handleUpload}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              追加する
            </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">オリジナルキャラクターの管理</h2>
        {customCharacters.length > 0 ? (
          <div className="space-y-3">
            {customCharacters.map(char => (
              <div key={char.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <img src={char.imageSrc} alt={char.name} className="w-12 h-12 object-contain rounded-md bg-white"/>
                <span className="font-semibold text-gray-800 flex-grow ml-4">{char.name}</span>
                <button 
                  onClick={() => handleDelete(char)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">追加されたオリジナルキャラクターはありません。</p>
        )}
      </div>

      <Link to="/" className={`w-full max-w-2xl ${tutorialStep === 3 ? 'pointer-events-none' : ''}`}>
        <button className={`w-full bg-[#9C27B0] hover:bg-[#7B1FA2] text-white font-bold py-4 px-8 rounded-lg text-xl font-roboto ${tutorialStep === 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
          ホームに戻る
        </button>
      </Link>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">キャラクターを選択</h2>
            <div className="mb-4 border-b pb-4">
              <button onClick={handleEmptySlot} className={`w-full text-white font-bold py-2 px-4 rounded-md transition-colors ${tutorialStep === 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`} disabled={tutorialStep === 3}>
                このスロットを空にする
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {selectableCharacters.map((char) => (
                <div key={char.id} className="p-3 bg-gray-100 rounded-lg text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleCharacterSelect(char)}>
                  <img src={char.imageSrc} alt={char.name} className="w-full h-24 object-contain mb-2" />
                  <p className="font-semibold text-gray-700">{char.name}</p>
                </div>
              ))}
              {selectableCharacters.length === 0 && <p className='col-span-4 text-center text-gray-500'>アンロック済みのgifや、追加したキャラクターがありません。</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkshopScreen;