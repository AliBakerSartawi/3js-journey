import './App.scss';
import { Suspense } from 'react';
import { Loader } from '@react-three/drei';
// import Lights from './lessons/Lights';
// import BasicScene from './lessons/BasicScene';
// import DebugUI from './lessons/DebugUI';
// import Geometries from './lessons/Geometries';
// import Materials from './lessons/Materials';
// import Textures from './lessons/Textures';
// import Text from './lessons/Text';
// import BakingShadows from './lessons/BakingShadows';
// import HauntedHouse from './lessons/HauntedHouse';
// import Particles from './lessons/Particles';
// import GalaxyGenerator from './lessons/GalaxyGenerator';
// import Template from './lessons/Template';
// import RayCaster from './lessons/RayCaster';
// import Physics from './lessons/Physics';
// import ImportedModels from './lessons/ImportedModels';
import RealisticRendering from './lessons/RealisticRendering';

function App() {
  return (
    <div className="app">
      <Suspense fallback={<CustomLoader />}>
        {/* TEMPLATE */}
        {/* <Template /> */}

        {/* 🤓 SCENES */}
        {/* <BasicScene /> */}
        {/* <Geometries /> */}
        {/* <DebugUI /> */}
        {/* <Textures /> */}
        {/* <Materials /> */}
        {/* <Text /> */}
        {/* <Lights /> */}
        {/* <BakingShadows /> */}
        {/* <HauntedHouse /> */}
        {/* <Particles /> */}
        {/* 🌟 GalaxyGenerator has a functional react-dat-gui panel */}
        {/* <GalaxyGenerator /> */}
        {/* <RayCaster /> */}
        {/* ➗ Physics with Leva GUI and 🔉 collision sounds */}
        {/* <Physics /> */}
        {/* 🖌️ Models & custom burger exported from Blender */}
        {/* <ImportedModels /> */}
        <RealisticRendering />
      </Suspense>
    </div>
  );
}

export default App;

function CustomLoader() {
  const containerStyles = {
    backgroundColor: 'crimson',
  }
  return (
    <Loader
      containerStyles={containerStyles} // ={...container} // Flex layout styles
      // innerStyles // ={...inner} // Inner container styles
      // barStyles // ={...bar} // Loading-bar styles
      // dataStyles // ={...data} // Text styles
      // dataInterpolation // ={(p) => `Loading ${p.toFixed(2)}%`} // Text
      initialState={active => console.log(active)} // ={(active) => active} // Initial black out state
    />
  );
}
