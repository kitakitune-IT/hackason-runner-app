import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';
import { availableCharacters } from '../data/characterData';
import type { Character } from '../data/characterData';
import backgroundImage from '../images/スーツケース.avif';

function WorkshopScreen() {
  const { 
    slots, updateSlot, unlockedCharacterIds, tutorialStep, setTutorialStep, 
    customCharacters, addCustomCharacter, deleteCustomCharacter,
    staticImages, pngSlots, addStaticImage, deleteStaticImage, updatePngSlot
  } = useCharacterContext();  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  
  const [newCharName, setNewCharName] = useState('');
  const [newPngName, setNewPngName] = useState('');
  const [newPngFile, setNewPngFile] = useState<File | null>(null);
  const pngFileInputRef = useRef<HTMLInputElement>(null);
  const [modalMode, setModalMode] = useState<'gif' | 'png'>('gif');

  const handlePngFileSelectClick = () => {
    pngFileInputRef.current?.click();
  };

  const handlePngFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png') {
        setMessage('PNG画像のみアップロードできます。');
        return;
      }
      setNewPngFile(file);
      setMessage(`ファイル選択OK: ${file.name}`);
    }
  };

  const handlePngUpload = async () => {
    if (!newPngName.trim()) {
      setMessage('静止画の名前を入力してください。');
      return;
    }
    if (!newPngFile) {
      setMessage('PNGファイルを選択してください。');
      return;
    }
    try {
      await addStaticImage(newPngName, newPngFile);
      setMessage(`「${newPngName}」を追加しました！`);
      setNewPngName('');
      setNewPngFile(null);
      if(pngFileInputRef.current) pngFileInputRef.current.value = '';
    } catch (error) {
      setMessage('静止画の追加に失敗しました。');
      console.error(error);
    }
  };

  const handlePngDelete = async (charToDelete: Character) => {
    if (window.confirm(`本当に「${charToDelete.name}」を削除しますか？`)) {
        try {
            await deleteStaticImage(charToDelete.id);
            setMessage(`「${charToDelete.name}」を削除しました。`);
        } catch (error) {
            setMessage('静止画の削除に失敗しました。');
            console.error(error);
        }
    }
  };
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
    setModalMode('gif');
    setSelectedSlotIndex(index);
    setIsModalOpen(true);
  };
    const handlePngSlotClick = (index: number) => {
    setModalMode('png');
    setSelectedSlotIndex(index);
    setIsModalOpen(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (selectedSlotIndex !== null) {
      if (modalMode === 'gif') {
        updateSlot(selectedSlotIndex, character);
        if (tutorialStep === 3 && selectedSlotIndex === 0) {
          setTutorialStep(4);
        }
      } else {
        updatePngSlot(selectedSlotIndex, character);
      }
    }
    setIsModalOpen(false);
    setSelectedSlotIndex(null);
  };
  
  const handleEmptySlot = () => {
    if (tutorialStep === 3) return;
    
    if (selectedSlotIndex !== null) {
      if (modalMode === 'gif') {
        updateSlot(selectedSlotIndex, null);
      } else {
        updatePngSlot(selectedSlotIndex, null);
      }
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

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`
  };

return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center p-4" style={backgroundStyle}>
       <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

      {tutorialStep === 3 && (
        <div className="bg-white shadow-lg rounded-lg p-4 my-4 border-2 border-blue-500 w-full max-w-2xl">
          <p className="text-center font-bold text-blue-600">「スロット1」をタップして、キャラクターをセットしましょう！</p>
        </div>
      )}

      {tutorialStep === 4 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setTutorialStep(5)}
        >
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-xs mx-auto">
            <p className="text-gray-800 text-lg text-center font-bold">
              これで、走行の準備は完了です！<br/>
              このアプリをお楽しみください！<br/>
              <span className="text-sm mt-4 block text-gray-600">(このメッセージをタップまたは背景をクリックしてチュートリアルを終了)</span>
            </p>
          </div>
        </div>
      )}
      
      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="text-4xl font-bold my-8 font-mincho text-white drop-shadow-lg">ワークショップ</h1>
        {message && <p className="text-center text-red-300 bg-black bg-opacity-50 rounded-md py-2 px-4 mb-4 font-bold">{message}</p>}
        
        {/* ▼▼▼【変更】コンテンツ全体を囲むラッパーを追加し、position:relative を指定 ▼▼▼ */}
        <div className="relative w-full max-w-2xl">
          
          {/* ▼▼▼【新規】背景専用の絶対配置パネル(-z-10でコンテンツの後ろへ) ▼▼▼ */}
          <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 rounded-lg shadow-lg -z-10"></div>
          
          {/* ▼▼▼【変更】コンテンツ本体のコンテナ。背景スタイルは削除し、パディング(p-6)で内側の余白を確保 ▼▼▼ */}
          <div className="p-6">
            <div className="mb-8">
              <p className="text-center text-gray-200 mb-6 drop-shadow-md">走行画面で使うキャラクター（GIF）を4つのスロットにセットしてください。</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {slots.map((slotCharacter, index) => (
                  <div key={index} onClick={() => handleSlotClick(index)} className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-white hover:bg-opacity-20 transition-colors ${getSlotClass(index)}`}>
                    <p className="font-bold text-gray-200 mb-2">スロット {index + 1}</p>
                    {slotCharacter ? ( <><img src={slotCharacter.imageSrc} alt={slotCharacter.name} className="w-24 h-24 mx-auto object-contain" /><p className="mt-2 font-semibold text-white">{slotCharacter.name}</p></> ) : ( <div className="w-24 h-24 mx-auto flex items-center justify-center bg-black bg-opacity-20 rounded-md"><p className="text-gray-400">空き</p></div> )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-center text-gray-200 mb-6 drop-shadow-md">走行画面で使う静止画（PNG）を4つのスロットにセットしてください。</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pngSlots.map((slotCharacter, index) => (
                  <div key={index} onClick={() => handlePngSlotClick(index)} className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-white hover:bg-opacity-20 transition-colors`}>
                    <p className="font-bold text-gray-200 mb-2">静止画 {index + 1}</p>
                    {slotCharacter ? ( <><img src={slotCharacter.imageSrc} alt={slotCharacter.name} className="w-24 h-24 mx-auto object-contain" /><p className="mt-2 font-semibold text-white">{slotCharacter.name}</p></> ) : ( <div className="w-24 h-24 mx-auto flex items-center justify-center bg-black bg-opacity-20 rounded-md"><p className="text-gray-400">空き</p></div> )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 border-b pb-2 drop-shadow-md">オリジナル画像 (GIF) の追加</h2>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input type="text" placeholder="画像名" value={newCharName} onChange={(e) => setNewCharName(e.target.value)} className="p-2 border rounded-md w-full sm:w-auto flex-grow bg-gray-200 text-gray-800 placeholder-gray-500"/>
                <input type="file" accept="image/gif" ref={fileInputRef} onChange={handleFileChange} className="hidden"/>
                <button onClick={handleFileSelectClick} className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors">GIFファイルを選択</button>
                <button onClick={handleUpload} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors">追加する</button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 border-b pb-2 drop-shadow-md">オリジナル画像 (GIF) の管理</h2>
              {customCharacters.length > 0 ? (
                <div className="space-y-3">
                  {customCharacters.map(char => (
                    <div key={char.id} className="flex items-center justify-between bg-black bg-opacity-30 p-2 rounded-lg">
                      <img src={char.imageSrc} alt={char.name} className="w-12 h-12 object-contain rounded-md bg-white p-1"/>
                      <span className="font-semibold text-gray-200 flex-grow ml-4">{char.name}</span>
                      <button onClick={() => handleDelete(char)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">削除</button>
                    </div>
                  ))}
                </div>
              ) : (<p className="text-center text-gray-300">追加されたオリジナル画像はありません。</p>)}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 border-b pb-2 drop-shadow-md">静止画 (PNG) の追加</h2>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <input type="text" placeholder="静止画名" value={newPngName} onChange={(e) => setNewPngName(e.target.value)} className="p-2 border rounded-md w-full sm:w-auto flex-grow bg-gray-200 text-gray-800 placeholder-gray-500"/>
                  <input type="file" accept="image/png" ref={pngFileInputRef} onChange={handlePngFileChange} className="hidden"/>
                  <button onClick={handlePngFileSelectClick} className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors">PNGファイルを選択</button>
                  <button onClick={handlePngUpload} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors">追加する</button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 border-b pb-2 drop-shadow-md">静止画の管理</h2>
              {staticImages.length > 0 ? (
                <div className="space-y-3">
                  {staticImages.map(char => (
                    <div key={char.id} className="flex items-center justify-between bg-black bg-opacity-30 p-2 rounded-lg">
                      <img src={char.imageSrc} alt={char.name} className="w-12 h-12 object-contain rounded-md bg-white p-1"/>
                      <span className="font-semibold text-gray-200 flex-grow ml-4">{char.name}</span>
                      <button onClick={() => handlePngDelete(char)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">削除</button>
                    </div>
                  ))}
                </div>
              ) : (<p className="text-center text-gray-300">追加された静止画はありません。</p>)}
            </div>
          </div>
          
          <div className="p-6">
            <Link to="/" className={`w-full ${tutorialStep === 3 ? 'pointer-events-none' : ''}`}>
              <button className={`w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-lg text-xl font-roboto shadow-lg ${tutorialStep === 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                ホームに戻る
              </button>
            </Link>
          </div>
        </div>
        {/* ▲▲▲【変更】ラッパーの閉じタグ ▲▲▲ */}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {modalMode === 'gif' ? 'キャラクターを選択' : '静止画を選択'}
            </h2>
            <div className="mb-4 border-b pb-4">
              <button onClick={handleEmptySlot} className={`w-full text-white font-bold py-2 px-4 rounded-md transition-colors ${tutorialStep === 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`} disabled={tutorialStep === 3}>
                このスロットを空にする
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {modalMode === 'gif' ? (
                <>
                  {selectableCharacters.map((char) => (
                    <div key={char.id} className="p-3 bg-gray-100 rounded-lg text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleCharacterSelect(char)}>
                      <img src={char.imageSrc} alt={char.name} className="w-full h-24 object-contain mb-2" />
                      <p className="font-semibold text-gray-700">{char.name}</p>
                    </div>
                  ))}
                  {selectableCharacters.length === 0 && <p className='col-span-4 text-center text-gray-500'>アンロック済みのgifや、追加したキャラクターがありません。</p>}
                </>
              ) : (
                <>
                  {staticImages.map((char) => (
                    <div key={char.id} className="p-3 bg-gray-100 rounded-lg text-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleCharacterSelect(char)}>
                      <img src={char.imageSrc} alt={char.name} className="w-full h-24 object-contain mb-2" />
                      <p className="font-semibold text-gray-700">{char.name}</p>
                    </div>
                  ))}
                  {staticImages.length === 0 && <p className='col-span-4 text-center text-gray-500'>追加した静止画がありません。</p>}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkshopScreen;