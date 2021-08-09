import './App.scss';
import { Suspense } from 'react';
import { Loader } from '@react-three/drei';
import Lights from './lessons/Lights';
// import BasicScene from './lessons/BasicScene';
// import DebugUI from './lessons/DebugUI';
// import Geometries from './lessons/Geometries';
import Materials from './lessons/Materials';
import Textures from './lessons/Textures';
import Text from './lessons/Text';
import BakingShadows from './lessons/BakingShadows';
import HauntedHouse from './lessons/HauntedHouse';

function App() {
  return (
    <div className="app">
      {/* <BasicScene /> */}
      {/* <Geometries /> */}
      {/* <DebugUI /> */}
      <Suspense fallback={<Loader />}>
        {/* <Textures /> */}
        {/* <Materials /> */}
        {/* <Text /> */}
        {/* <Lights /> */}
        {/* <BakingShadows /> */}
        <HauntedHouse />
      </Suspense>
      
    </div>
  );
}

export default App;
