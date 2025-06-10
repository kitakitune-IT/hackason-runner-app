import { Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import RunningScreen from './pages/RunningScreen';
import ShopScreen from './pages/ShopScreen';
import WorkshopScreen from './pages/WorkshopScreen'; // ← コメントアウトされていないことを確認
import ResultScreen from './pages/ResultScreen';
import RecordScreen from './pages/RecordScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/running" element={<RunningScreen />} />
      <Route path="/shop" element={<ShopScreen />} />
      <Route path="/workshop" element={<WorkshopScreen />} /> {/* ← コメントアウトされていないことを確認 */}
      <Route path="/result" element={<ResultScreen />} />
      <Route path="/record" element={<RecordScreen />} />
    </Routes>
  );
}

export default App;