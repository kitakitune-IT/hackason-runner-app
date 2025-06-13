import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';
import windowImage from '../images/車窓.jpg';

function HomeScreen() {
  const navigate = useNavigate();
  const { tutorialStep, setTutorialStep, resetAllData, unlockedCharacterIds, slots } = useCharacterContext();

  const isTutorialActive = tutorialStep < 5;

  // ▼▼▼【変更】チュートリアルの進行状況を自動でチェックし、適切なステップまで進めるロジックを強化 ▼▼▼
  useEffect(() => {
    // 既にチュートリアルが完了している場合は何もしない
    if (!isTutorialActive) return;

    // 条件を満たしているのにチュートリアルの段階が追いついていない場合、ステップを早送りする
    
    // スロット1にキャラクターがセット済みの場合 → ステップ4に進める
    if (tutorialStep < 4 && slots[0] !== null) {
      setTutorialStep(4);
      return; // 複数のsetTutorialStepが同時に実行されるのを防ぐ
    }
    // ミーム（id:1）がアンロック済みの場合 → ステップ2に進める
    if (tutorialStep < 2 && unlockedCharacterIds.includes(1)) {
      setTutorialStep(2);
    }
  }, [tutorialStep, unlockedCharacterIds, slots, setTutorialStep, isTutorialActive]);

  // ▼▼▼【変更】resetAllDataをawaitで待つように、関数をasyncにする ▼▼▼
  const handleDeleteAllData = async () => {
    if (window.confirm('本当にすべてのデータを削除しますか？\nこの操作は元に戻せません。')) {
      if (window.confirm('最終確認：本当によろしいですか？')) {
        await resetAllData(); // DB操作の完了を待つ
        window.location.reload();
      }
    }
  };

  const handleTutorialNavigation = (path: string, requiredStep: number, nextStep: number) => {
    if (isTutorialActive) {
      if (tutorialStep === requiredStep) {
        setTutorialStep(nextStep);
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  const getButtonClass = (step: number) => {
    return tutorialStep === step ? 'animate-pulse ring-4 ring-white' : '';
  };
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTutorialActive) {
      e.preventDefault();
    }
  };

  const backgroundStyle = { backgroundImage: `url(${windowImage})` };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 relative" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="absolute top-4 right-4 z-20"><button onClick={handleDeleteAllData} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm">データ完全削除</button></div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 font-mincho text-white drop-shadow-lg">こころの車窓から</h1>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link to="/running" onClick={handleLinkClick}>
            <button className={`w-full bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 text-white font-bold py-4 px-8 rounded-xl text-2xl font-roboto transition-all hover:bg-opacity-30 ${isTutorialActive && 'opacity-50 cursor-not-allowed'}`} disabled={isTutorialActive}>
              走行開始
            </button>
          </Link>
          <div className="grid grid-cols-3 gap-3 w-full mt-4">
            <button 
              onClick={() => handleTutorialNavigation('/shop', 0, 1)} 
              className={`w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white font-bold py-3 px-4 rounded-lg text-base font-roboto transition-all hover:bg-opacity-20 ${getButtonClass(0)} ${isTutorialActive && tutorialStep !== 0 && 'opacity-50 cursor-not-allowed'}`}
              disabled={isTutorialActive && tutorialStep !== 0}
            >
              ショップ
            </button>
            <button 
              onClick={() => handleTutorialNavigation('/workshop', 2, 3)} 
              className={`w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white font-bold py-3 px-4 rounded-lg text-base font-roboto transition-all hover:bg-opacity-20 ${getButtonClass(2)} ${isTutorialActive && tutorialStep !== 2 && 'opacity-50 cursor-not-allowed'}`}
              disabled={isTutorialActive && tutorialStep !== 2}
            >
              ワークショップ
            </button>
            <Link to="/record" onClick={handleLinkClick}>
              <button className={`w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white font-bold py-3 px-4 rounded-lg text-base font-roboto transition-all hover:bg-opacity-20 ${isTutorialActive && 'opacity-50 cursor-not-allowed'}`} disabled={isTutorialActive}>
                記録
              </button>
            </Link>
          </div>
        </div>
      </div>
      {isTutorialActive && (
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          {(tutorialStep === 0 || tutorialStep === 2) && (
            <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs mx-auto pointer-events-auto">
              <p className="text-gray-800 text-lg text-center font-bold">
                {tutorialStep === 0 && 'ようこそ！\nまずは、「ショップ」に行ってみましょう。'}
                {tutorialStep === 2 && 'おかえりなさい！\n次は、「ワークショップ」でキャラクターをセットしましょう。'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomeScreen;