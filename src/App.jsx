import { Suspense } from 'react';
import './App.scss';
import BasicScene from './lessons/BasicScene';
// import DebugUI from './lessons/DebugUI';
import Geometries from './lessons/Geometries';
import Materials from './lessons/Materials';
import Text from './lessons/Text';
import Textures from './lessons/Textures';

function App() {
  return (
    <div className="app">
      {/* <BasicScene /> */}
      {/* <Geometries /> */}
      {/* <DebugUI /> */}
      <Suspense fallback={null}>
        {/* <Textures /> */}
        {/* <Materials /> */}
        <Text />
      </Suspense>
    </div>
  );
}

export default App;
