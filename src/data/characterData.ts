// 1. まず、用意した画像をすべてインポートする
import memeCharacter from '../assets/spinning-cat-stop.gif'; // ファイル名はあなたが入れたものに合わせてね
import catlikeCharacter from '../assets/catlike.gif';
import emuCharacter from '../assets/emu-14760_256.gif';
import horseCharacter from '../assets/horse_256.gif';
import gundumCharacter from '../assets/オルガ・イツカ.gif';
import racoonCharacter from '../assets/たぬき.gif';

// 2. キャラクターの型を定義する
export interface Character {
  id: number;
  name: string;
  imageSrc: string;
  price?: number;
}

// 3. インポートした画像を、キャラクターのデータと紐づけてリスト化する
export const availableCharacters: Character[] = [
  { id: 1, name: 'ミーム', imageSrc: memeCharacter, price: 0},
  { id: 2, name: '猫っぽいの', imageSrc: catlikeCharacter, price: 0 },
  { id: 3, name: 'エミュー', imageSrc: emuCharacter, price: 0 },
  { id: 4, name: '馬', imageSrc: horseCharacter, price: 0 },
  { id: 5, name: 'オルガ・イツカ', imageSrc: gundumCharacter, price: 100},
  { id: 6, name: 'たぬき', imageSrc: racoonCharacter, price: 0}
  // ...もし画像が増えたら、ここに追加していく
];