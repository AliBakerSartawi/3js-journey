import './App.scss';
import './Leva.css'
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CustomLoader from './components/CustomLoader';
// import ShaderPatterns from './lessons/ShaderPatterns';
// import axios from 'axios';
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
// import RagingSea from './lessons/RagingSea';
import AnimatedGalaxy from './lessons/AnimatedGalaxy';
// import ImportedModels from './lessons/ImportedModels';
// import RealisticRendering from './lessons/RealisticRendering';
// import Shaders from './lessons/Shaders';

function App() {
  const app = useRef();
  const [loaded, setLoaded] = useState(false);
  // const [ready, setReady] = useState(false);

  // useEffect(() => {
  //     if (loaded) {
  //       gsap.to(app.current, {
  //         duration: 0.5,
  //         opacity: 1,
  //         delay: 0.5
  //       });
  //     }
  // }, [loaded]);

  useEffect(() => {
    app.current &&
      gsap.to(app.current, {
        duration: 1,
        opacity: 1,
        delay: 0.5
      });
  }, [app]);

  return (
    <Suspense fallback={<CustomLoader setLoaded={setLoaded} />}>
      <div ref={app} className="app">
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
        {/* <RealisticRendering /> */}
        {/* 🤯 SHADERS */}
        {/* <Shaders /> */}
        {/* <ShaderPatterns /> */}
        {/* <RagingSea /> */}
        <AnimatedGalaxy />
      </div>
    </Suspense>
  );
}

export default App;
