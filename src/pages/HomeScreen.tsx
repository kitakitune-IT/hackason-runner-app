// ▼▼▼【修正】import文を、それぞれのライブラリから、正しく読み込むように修正 ▼▼▼
import { useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';
import windowImage from '../images/車窓.jpg';

function HomeScreen() {
  const navigate = useNavigate();
  const { tutorialStep, advanceTutorialStep, resetAllData, unlockedCharacterIds, slots } = useCharacterContext();

  useEffect(() => {
    // ステップ1の条件（ミーム購入）が、すでに満たされていたら、ステップ2に自動で進める
    if (tutorialStep === 1 && unlockedCharacterIds.includes(1)) {
      advanceTutorialStep();
    }
    // ステップ3の条件（スロット1にセット）が、すでに満たされていたら、ステップ4に自動で進める
    if (tutorialStep === 3 && slots[0] !== null) {
      advanceTutorialStep();
    }
  }, [tutorialStep, unlockedCharacterIds, slots, advanceTutorialStep]);

  const handleResetTutorial = () => {
    if (window.confirm('チュートリアルを再度行いますか？')) {
      if (window.confirm('注意：すべての走行記録やポイントもリセットされます。よろしいですか？')) {
        resetAllData();
        window.location.reload();
      }
    }
  };

  const handleDeleteAllData = () => {
    if (window.confirm('本当にすべてのデータを削除しますか？\nこの操作は元に戻せません。')) {
      if (window.confirm('最終確認：本当によろしいですか？')) {
        resetAllData();
        window.location.reload();
      }
    }
  };

  const handleTutorialNavigation = (path: string, requiredStep: number) => {
    // チュートリアルが完了（step 5以上）していれば、自由に移動できる
    if (tutorialStep >= 5) {
      navigate(path);
      return;
    }
    if (tutorialStep === requiredStep) {
      advanceTutorialStep();
      navigate(path);
    }
  };

  const backgroundStyle = { backgroundImage: `url(${windowImage})` };

  const getButtonClass = (step: number) => {
    return tutorialStep === step ? 'animate-pulse ring-4 ring-white' : '';
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 relative"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="absolute top-4 left-4 z-20">
        <button onClick={handleResetTutorial} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm">チュートリアル</button>
      </div>
      <div className="absolute top-4 right-4 z-20">
        <button onClick={handleDeleteAllData} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm">データ完全削除</button>
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 font-mincho text-white drop-shadow-lg">こころの車窓から</h1>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link to="/running">
            <button className="w-full bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 text-white font-bold py-4 px-8 rounded-xl text-2xl font-roboto transition-all hover:bg-opacity-30">走行開始</button>
          </Link>
          <div className="grid grid-cols-3 gap-3 w-full mt-4">
            <button onClick={() => handleTutorialNavigation('/shop', 0)} className={`w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white font-bold py-3 px-4 rounded-lg text-base font-roboto transition-all hover:bg-opacity-20 ${getButtonClass(0)}`}>ショップ</button>
            <button onClick={() => handleTutorialNavigation('/workshop', 3)} className={`w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white font-bold py-3 px-4 rounded-lg text-base font-roboto transition-all hover:bg-opacity-20 ${getButtonClass(3)}`}>ワークショップ</button>
            <Link to="/record"><button className="w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white font-bold py-3 px-4 rounded-lg text-base font-roboto transition-all hover:bg-opacity-20">記録</button></Link>
          </div>
        </div>
      </div>

      {tutorialStep < 5 && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          {(tutorialStep === 0 || tutorialStep === 3) && (
            <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs mx-auto pointer-events-auto">
              <p className="text-gray-800 text-lg text-center font-bold">
                {tutorialStep === 0 && 'ようこそ！\nまずは、「ショップ」に行ってみましょう。'}
                {tutorialStep === 3 && '次は、「ワークショップ」で\nキャラクターをセットしましょう。'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomeScreen;