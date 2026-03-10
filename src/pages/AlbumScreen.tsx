import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';
import backgroundImage from '../images/汽車.jpg'; // RecordScreenと同じ背景画像を使用

function AlbumScreen() {
  const { albumPhotos, deleteAlbumPhotos } = useCharacterContext();
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('');

  // ▼▼▼【新規】チェックボックスの状態を切り替えるハンドラ ▼▼▼
  const handleCheckboxChange = (id: number) => {
    setSelectedPhotoIds(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(photoId => photoId !== id)
        : [...prevSelected, id]
    );
  };

  // ▼▼▼【新規】すべての写真を選択するハンドラ ▼▼▼
  const handleSelectAll = () => {
    setSelectedPhotoIds(albumPhotos.map(photo => photo.id));
  };

  // ▼▼▼【新規】写真の選択をすべて解除するハンドラ ▼▼▼
  const handleDeselectAll = () => {
    setSelectedPhotoIds([]);
  };

  // ▼▼▼【新規】選択した写真を削除するハンドラ ▼▼▼
  const handleDeleteSelected = async () => {
    if (selectedPhotoIds.length === 0) {
      setMessage("削除する写真が選択されていません。");
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (window.confirm(`${selectedPhotoIds.length}枚の写真を本当に削除しますか？`)) {
      try {
        await deleteAlbumPhotos(selectedPhotoIds);
        setMessage(`${selectedPhotoIds.length}枚の写真を削除しました。`);
        setSelectedPhotoIds([]); // 削除後に選択状態をリセット
      } catch (error) {
        setMessage('写真の削除に失敗しました。');
        console.error(error);
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // ▼▼▼【新規】写真をダウンロードするハンドラ ▼▼▼
  const handleDownload = (src: string, createdAt: Date) => {
    const link = document.createElement('a');
    link.href = src;
    // 日付からファイル名を生成 (例: photo-2025-06-17-18-30-00.jpg)
    const filename = `photo-${createdAt.toISOString().slice(0, 19).replace(/:/g, '-')}.jpg`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center p-4" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full">
        
        <div className='w-full max-w-[1000px] flex justify-between items-center my-8'>
          <h1 className="text-3xl font-bold font-roboto text-white drop-shadow-lg">アルバム</h1>
          <Link to="/" className='bg-white bg-opacity-30 hover:bg-opacity-40 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-lg'>
            ホームに戻る
          </Link>
        </div>
        
        <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-lg shadow-lg p-6 w-full max-w-[1000px] mb-8">
          
          {/* ▼▼▼【新規】操作ボタンエリア ▼▼▼ */}
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-white border-opacity-20">
            <button
              onClick={handleSelectAll}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-md"
            >
              すべて選択
            </button>
            <button
              onClick={handleDeselectAll}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-md"
            >
              選択をすべて解除
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedPhotoIds.length === 0}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              選択した写真を削除 ({selectedPhotoIds.length})
            </button>
            {message && <p className="self-center text-green-300">{message}</p>}
          </div>

          {/* ▼▼▼【新規】写真表示グリッド ▼▼▼ */}
          {albumPhotos.length === 0 ? (
            <p className="text-center text-gray-400 py-16">撮影された写真はありません。</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albumPhotos.map((photo) => (
                <div key={photo.id} className="relative group bg-black rounded-lg overflow-hidden shadow-lg">
                  <img src={photo.src} alt={`撮影日時: ${photo.createdAt.toLocaleString()}`} className="w-full h-full object-cover aspect-square" />
                  
                  {/* チェックボックス */}
                  <input
                    type="checkbox"
                    checked={selectedPhotoIds.includes(photo.id)}
                    onChange={() => handleCheckboxChange(photo.id)}
                    className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
                  />
                  
                  {/* ダウンロードボタンと撮影日時 */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60 flex justify-between items-center">
                    <p className="text-white text-xs">{photo.createdAt.toLocaleDateString()}</p>
                    <button onClick={() => handleDownload(photo.src, photo.createdAt)} className="text-white hover:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlbumScreen;