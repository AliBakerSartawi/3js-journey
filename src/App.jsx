import { Suspense } from 'react';
import './App.scss';
import BasicScene from './lessons/BasicScene';
import DebugUI from './lessons/DebugUI';
import Geometries from './lessons/Geometries';
import Textures from './lessons/Textures';

function App() {
  return (
    <div className="app">
      {/* <BasicScene /> */}
      {/* <Geometries /> */}
      {/* <DebugUI /> */}
      <Suspense fallback={null}>
        <Textures />
      </Suspense>
    </div>
  );
}

export default App;
