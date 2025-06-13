import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCharacterContext } from '../contexts/CharacterContext';

const SIZE_STEP = 24;
const MIN_SIZE = 32;
const MAX_SIZE = 512;
const JUMP_STRENGTH = -5.0; 
const GRAVITY = 0.0625;

function RunningScreen() {
  const navigate = useNavigate();
  const { slots } = useCharacterContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [characterPosition, setCharacterPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [characterSize, setCharacterSize] = useState<number>(240);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState<boolean>(false);
  const [isUiVisible, setIsUiVisible] = useState<boolean>(true);

  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [jumpVelocity, setJumpVelocity] = useState<number>(0);
  const [startYPosition, setStartYPosition] = useState<number>(0);
  const [characterDisplayPosition, setCharacterDisplayPosition] = useState<number>(50);

  const [isSizeDragging, setIsSizeDragging] = useState<boolean>(false);
  const sizeSliderRef = useRef<HTMLDivElement | null>(null);

  const currentCharacter = slots[activeSlotIndex];

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).mozRequestFullScreen) { // Firefox
      (element as any).mozRequestFullScreen();
    } else if ((element as any).webkitRequestFullscreen) { // Chrome, Safari, Opera
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) { // IE/Edge
      (element as any).msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream: MediaStream) => { if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch((err: any) => { console.error(err); setError("カメラの起動に失敗しました"); });
    }
    return () => {
        if(document.fullscreenElement) {
            exitFullscreen();
        }
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const animateJump = () => {
      if (!isJumping) return;
      setCharacterDisplayPosition(prev => {
        let newPosition = prev + jumpVelocity;
        setJumpVelocity(prevVel => prevVel + GRAVITY);
        if (newPosition < 0) {
          newPosition = 0;
          setJumpVelocity(0);
        }
        if (newPosition >= startYPosition && jumpVelocity > 0) {
          setIsJumping(false);
          setJumpVelocity(0);
          return startYPosition;
        }
        return newPosition;
      });
      animationFrameId = requestAnimationFrame(animateJump);
    };
    if (isJumping) {
      animationFrameId = requestAnimationFrame(animateJump);
    }
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isJumping, jumpVelocity, startYPosition]);

  const updateCharacterPosition = useCallback((clientY: number) => {
    if (!sliderRef.current) return;
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const relativeY = clientY - sliderRect.top;
    const percentage = Math.max(0, Math.min(100, (relativeY / sliderRect.height) * 100));
    setCharacterPosition(percentage);
    
    if (!isJumping) {
      setCharacterDisplayPosition(percentage);
    }
  }, [isJumping]);

  const updateCharacterSize = useCallback((clientY: number) => {
    if (!sizeSliderRef.current) return;
    const sliderRect = sizeSliderRef.current.getBoundingClientRect();
    const relativeY = clientY - sliderRect.top;
    const percentage = Math.max(0, Math.min(100, (relativeY / sliderRect.height) * 100));
    const newSize = MAX_SIZE - (percentage / 100) * (MAX_SIZE - MIN_SIZE);
    const snappedSize = Math.round(newSize / SIZE_STEP) * SIZE_STEP;
    setCharacterSize(snappedSize);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); updateCharacterPosition(e.clientY); }, [updateCharacterPosition]);
  const handleMouseMove = useCallback((e: MouseEvent) => { if (isDragging) { e.preventDefault(); updateCharacterPosition(e.clientY); } }, [isDragging, updateCharacterPosition]);
  const handleMouseUp = useCallback(() => { setIsDragging(false); }, []);
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); updateCharacterPosition(e.touches[0].clientY); }, [updateCharacterPosition]);
  const handleTouchMove = useCallback((e: TouchEvent) => { if (isDragging) { e.preventDefault(); updateCharacterPosition(e.touches[0].clientY); } }, [isDragging, updateCharacterPosition]);
  
  const handleSizeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsSizeDragging(true); updateCharacterSize(e.clientY); }, [updateCharacterSize]);
  const handleSizeMouseMove = useCallback((e: MouseEvent) => { if (isSizeDragging) { e.preventDefault(); updateCharacterSize(e.clientY); } }, [isSizeDragging, updateCharacterSize]);
  const handleSizeMouseUp = useCallback(() => { setIsSizeDragging(false); }, []);
  const handleSizeTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsSizeDragging(true); updateCharacterSize(e.touches[0].clientY); }, [updateCharacterSize]);
  const handleSizeTouchMove = useCallback((e: TouchEvent) => { if (isSizeDragging) { e.preventDefault(); updateCharacterSize(e.touches[0].clientY); } }, [isSizeDragging, updateCharacterSize]);

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

  useEffect(() => {
    if (isSizeDragging) {
      document.addEventListener("mousemove", handleSizeMouseMove);
      document.addEventListener("mouseup", handleSizeMouseUp);
      document.addEventListener("touchmove", handleSizeTouchMove, { passive: false });
      document.addEventListener("touchend", handleSizeMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleSizeMouseMove);
        document.removeEventListener("mouseup", handleSizeMouseUp);
        document.removeEventListener("touchmove", handleSizeTouchMove);
        document.removeEventListener("touchend", handleSizeMouseUp);
      };
    }
  }, [isSizeDragging, handleSizeMouseMove, handleSizeMouseUp, handleSizeTouchMove]);

  const handleStartRun = () => {
    enterFullscreen();
    setError(null);
    setStartTime(Date.now());
    setIsRunning(true);
    setCharacterDisplayPosition(characterPosition);
  };

  const handleEndRun = () => {
    exitFullscreen();
    if (!startTime) {
      setError("走行開始情報が記録されていません。");
      return;
    }
    const params = new URLSearchParams({ startTime: startTime.toString() });
    navigate(`/result?${params.toString()}`);
  };
  
  const handleJump = () => {
    if (!isJumping && isRunning) {
      setStartYPosition(characterPosition);
      setJumpVelocity(JUMP_STRENGTH);
      setIsJumping(true);
    }
  };

  const sizeKnobPosition = ((MAX_SIZE - characterSize) / (MAX_SIZE - MIN_SIZE)) * 100;

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <Link to="/" className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </Link>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ top: `${characterDisplayPosition}%`, width: `${characterSize}px`, height: `${characterSize}px` }}>
        {currentCharacter ? (
          <img src={currentCharacter.imageSrc} alt={currentCharacter.name} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full bg-red-500 bg-opacity-50 flex items-center justify-center text-white text-center rounded-lg">スロットが空です</div>
        )}
      </div>

      {isUiVisible && (
        <>
          <div 
            ref={sizeSliderRef} 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-1/2 bg-gray-200 bg-opacity-50 cursor-pointer rounded-lg z-50 flex justify-center py-4"
            onMouseDown={handleSizeMouseDown} 
            onTouchStart={handleSizeTouchStart} 
          >
            <span className="absolute -top-6 text-white text-sm select-none">サイズ</span>
            <div 
              className="absolute w-10 h-10 bg-blue-500 rounded-full left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg"
              style={{ top: `${sizeKnobPosition}%`, cursor: isSizeDragging ? "grabbing" : "grab" }} 
            />
          </div>

          <div 
            ref={sliderRef} 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-1/2 bg-gray-200 bg-opacity-50 cursor-pointer rounded-lg z-50 flex justify-center py-4"
            onMouseDown={handleMouseDown} 
            onTouchStart={handleTouchStart} 
          >
            <span className="absolute -top-6 text-white text-sm select-none">位置</span>
            <div 
              className="absolute w-10 h-10 bg-blue-500 rounded-full left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg"
              style={{ top: `${characterPosition}%`, cursor: isDragging ? "grabbing" : "grab" }} 
            />
          </div>
        </>
      )}

      <div className="absolute inset-x-0 bottom-4 flex flex-col justify-end items-center p-4 pointer-events-none">
        <div className="flex flex-col items-center gap-4 pointer-events-auto">
          {!isRunning ? (
            <button onClick={handleStartRun} className="bg-[#4CAF50] text-white font-bold py-3 px-10 rounded-full text-xl font-roboto shadow-lg">走行開始</button>
          ) : (
            // ▼▼▼【変更】走行中のボタンレイアウトを変更 ▼▼▼
            <div className="flex flex-row items-center justify-center gap-8">
              {/* UI表示時のみジャンプボタンを表示 */}
              {isUiVisible && (
                <button
                  onClick={handleJump}
                  disabled={isJumping}
                  // 開始/終了ボタンと同じサイズに
                  className={`bg-blue-500 text-white font-bold py-3 px-10 rounded-full text-xl font-roboto shadow-lg ${isJumping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 transition'}`}
                >
                  ジャンプ
                </button>
              )}
              <button onClick={handleEndRun} className="bg-[#f44336] text-white font-bold py-3 px-10 rounded-full text-xl font-roboto shadow-lg">走行終了</button>
            </div>
          )}
        </div>
      </div>
      
      {/* ▼▼▼【変更】左下のボタン群のレイアウトがずれないように修正 ▼▼▼ */}
      <div className="absolute bottom-24 left-4 z-50 flex flex-col-reverse gap-4 pointer-events-auto">
        {/* UI表示/非表示ボタンを一番下に配置 */}
        <button onClick={() => setIsUiVisible(prev => !prev)} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition">
          {isUiVisible ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" /></svg> )}
        </button>
        {/* キャラクター変更ボタンの表示をCSSで制御 */}
        <button 
          onClick={() => setIsSlotModalOpen(true)} 
          className={`bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-opacity duration-300 ${isUiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>

      {error && (<div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#f44336] text-white p-4 rounded-lg font-roboto z-50 max-w-[calc(100%-2rem)] text-center shadow-lg">{error}</div>)}
      
      {isSlotModalOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setIsSlotModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">スロットを選択</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {slots.map((slotCharacter, index) => (
                <div key={index} className="border-2 border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100" onClick={() => { if (slotCharacter) { setActiveSlotIndex(index); setIsSlotModalOpen(false); } }}>
                  <p className="font-bold text-gray-500 mb-2">スロット {index + 1}</p>
                  {slotCharacter ? ( <><img src={slotCharacter.imageSrc} alt={slotCharacter.name} className="w-full h-20 object-contain" /><p className="mt-1 text-sm font-semibold truncate">{slotCharacter.name}</p></> ) : ( <div className="w-full h-20 flex items-center justify-center bg-gray-100 rounded-md"><p className="text-gray-400 text-sm">空き</p></div> )}
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