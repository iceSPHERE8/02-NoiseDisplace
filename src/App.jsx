import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import PosterPlane from './components/three-components/poster-plane'

import './App.css'

function App() {

  return (
    <>
      <Canvas
        orthographic
        camera={{
          position: [0, 0, 1500],
          zoom: 0.5,
          near: 0.1,
          far: 10000,
        }}
      >
        <OrbitControls />
        <PosterPlane />
      </Canvas>
    </>
  )
}

export default App
