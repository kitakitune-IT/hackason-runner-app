import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import defaultCharacter from '../images/spinning-cat-stop.gif';
import rabbitCharacter from '../images/catlike.gif'; 
import emuCharacter from '../images/emu-14760_256.gif';
//import horseCharacter from '../images/horse_256.gif';

interface Character {
  id: number;
  name: string;
  imageSrc: string;
}

const characters: Character[] = [
  { id: 3, name: 'ミーム', imageSrc: defaultCharacter },
  { id: 2, name: '猫っぽいの', imageSrc: rabbitCharacter },
   { id: 1, name: 'エミュー', imageSrc: emuCharacter},
//   { id: 4, name: '馬', imageSrc: horseCharacter}
];

function RunningScreen() {
  const navigate = useNavigate();
  const [characterPosition, setCharacterPosition] = useState<number>(50);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentCharacter, setCurrentCharacter] = useState<Character>(characters[0]);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [characterScale, setCharacterScale] = useState<number>(1);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream: MediaStream) => { if (videoRef) videoRef.srcObject = stream; })
        .catch((err: any) => { console.error(err); setError("カメラの起動に失敗しました"); });
    }
  }, [videoRef]);
  
  const handlePositionDrag = useCallback((clientY: number) => {
    if (!sliderRef.current) return;
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const relativeY = clientY - sliderRect.top;
    const percentage = Math.max(0, Math.min(100, (relativeY / sliderRect.height) * 100));
    setCharacterPosition(percentage);
  }, []);
  
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => { setIsDragging(true); handlePositionDrag(e.clientY); }, [handlePositionDrag]);
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => { setIsDragging(true); handlePositionDrag(e.touches[0].clientY); }, [handlePositionDrag]);
  const handleMouseUp = useCallback(() => { setIsDragging(false); }, []);
  const handleMouseMove = useCallback((e: MouseEvent) => { if(isDragging) handlePositionDrag(e.clientY); }, [isDragging, handlePositionDrag]);
  const handleTouchMove = useCallback((e: TouchEvent) => { if(isDragging) handlePositionDrag(e.touches[0].clientY); }, [isDragging, handlePositionDrag]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleStartRun = () => { setError(null); setStartTime(Date.now()); setIsRunning(true); };
  const handleEndRun = () => { if (!startTime) { setError("走行開始情報が記録されていません。"); return; } const params = new URLSearchParams({ startTime: startTime.toString() }); navigate(`/result?${params.toString()}`); };
  const handleCharacterSelect = (character: Character) => { setCurrentCharacter(character); setIsSelectorOpen(false); };
  
  // ▼▼▼【修正点1】サイズの変化量を5倍に(0.1 → 0.5) ▼▼▼
  const increaseSize = () => setCharacterScale(scale => Math.min(5, scale + 0.5));
  const decreaseSize = () => setCharacterScale(scale => Math.max(0.2, scale - 0.5));

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden select-none">
      <video ref={setVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <Link to="/" className="absolute top-4 left-4 z-30 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></Link>
      
      <div className="absolute left-1/2" style={{ top: `${characterPosition}%`, transform: `translateX(-50%)` }} >
        <img src={currentCharacter.imageSrc} alt={currentCharacter.name} className="object-contain" style={{ width: '6rem', height: '6rem', transform: `scale(${characterScale})` }}/>
      </div>

      <div ref={sliderRef} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} className="absolute right-4 top-4 bottom-4 w-12 bg-black bg-opacity-50 cursor-ns-resize rounded-lg z-20">
        {/* ▼▼▼【修正点2】Y軸スライダーのつまみのズレを修正 ▼▼▼ */}
        <div className="absolute w-8 h-8 bg-white rounded-full left-1/2" style={{ top: `${characterPosition}%`, transform: "translateX(-50%) translateY(-50%)" }} />
      </div>

      <div className="absolute bottom-4 left-4 z-30">
        <button onClick={() => setIsSelectorOpen(true)} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
      </div>

      {/* ▼▼▼【修正点3】サイズ調整ボタンの位置をずらす (right-4 → right-20) ▼▼▼ */}
      <div className="absolute bottom-4 right-20 z-30 flex flex-col gap-2">
          <button onClick={increaseSize} className="bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold hover:bg-opacity-75 transition">+</button>
          <button onClick={decreaseSize} className="bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold hover:bg-opacity-75 transition">-</button>
      </div>
      
      <div className="absolute inset-x-0 bottom-4 flex justify-center p-4 pointer-events-none">
        <div className="flex flex-col items-center gap-4 pointer-events-auto z-10">
          {!isRunning ? ( <button onClick={handleStartRun} className="bg-[#4CAF50] text-white font-bold py-3 px-10 rounded-full text-xl font-roboto shadow-lg">走行開始</button> ) : ( <button onClick={handleEndRun} className="bg-[#f44336] text-white font-bold py-3 px-10 rounded-full text-xl font-roboto shadow-lg">走行終了</button> )}
        </div>
      </div>
      
      {error && (<div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#f44336] text-white p-4 rounded-lg font-roboto z-50 max-w-[calc(100%-2rem)] text-center shadow-lg">{error}</div>)}

      {/* ▼▼▼【修正点4】キャラクター選択パネルの中身を、省略せず全て記述 ▼▼▼ */}
      {isSelectorOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50" onClick={() => setIsSelectorOpen(false)}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-center font-roboto">アバターを選択</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {characters.map((char) => (
                <div key={char.id} onClick={() => handleCharacterSelect(char)} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
                  <img src={char.imageSrc} alt={char.name} className="w-20 h-20 object-contain bg-gray-300 rounded-md" />
                  <span className="font-roboto">{char.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RunningScreen;