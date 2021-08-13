import './App.scss';
import { Suspense } from 'react';
import { Html, Loader, useProgress } from '@react-three/drei';
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
    <Suspense fallback={<CustomLoader />}>
      <div className="app">
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
      </div>
    </Suspense>
  );
}

export default App;

function CustomLoader() {
  const containerStyles = {
    backgroundColor: 'crimson',
    fontSize: '20px',
  }
  const innerStyles = {
    // display: 'flex',
    // justifyContent: 'center'
  }
  const barStyles = {
    // display: 'none',
    width: '75vh'
  }
  const dataStyles = {
    fontFamily: 'Fira Code',
    textAlign: 'center'
  }
  return (
    <Loader
      containerStyles={containerStyles}
      innerStyles={innerStyles}
      barStyles={barStyles} 
      dataStyles={dataStyles}
      dataInterpolation={(p) => `Still thinking ${p.toFixed(0)}%`} // ={(p) => `Loading ${p.toFixed(2)}%`} // Text
      // initialState={active => console.log(active)}
    />
  );
}
