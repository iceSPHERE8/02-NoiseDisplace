import * as THREE from "three";
import { useRef } from "react";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useControls } from "leva";

import waveVertexShader from "./shaders/wave/vertex.glsl";
import waveFragmentShader from "./shaders/wave/fragment.glsl";

const PosterPlaneShaderMate = shaderMaterial(
  {
    uTexture: null,
    uResolution: new THREE.Vector2(1080, 1920),
    uTime: 0,
    uScale: new THREE.Vector2(1, 1),
    uStrength: 0
  },
  waveVertexShader,
  waveFragmentShader
);

extend({ PosterPlaneShaderMate });

export default function PosterPlane() {
  /**
   * GUI Parameters
   */
  const { speed, noiseScaleX, noiseScaleY, displaceStrength } = useControls({
    speed: {
      value: 1,
      min: 0,
      max: 10,
      step: 0.01
    },
    noiseScaleX: {
      value: 1,
      min: 0,
      max: 50,
      step: 0.001
    },
    noiseScaleY: {
      value: 1,
      min: 0,
      max: 50,
      step: 0.001
    },
    displaceStrength: {
      value: 1,
      min: 0, 
      max: 1,
      step: 0.001
    }
  })

  const posterImage = useTexture("../../poster.jpg");
  const posterImageWidth = posterImage.image.width;
  const posterImageHeight = posterImage.image.height;

  const shader = useRef();

  useFrame((state) => {
    shader.current.uniforms.uTime.value = state.clock.elapsedTime * speed;
    shader.current.uniforms.uScale.value = new THREE.Vector2(noiseScaleX, noiseScaleY);
    shader.current.uniforms.uStrength.value = displaceStrength;
  })

  return (
    <mesh>
      <planeGeometry
        args={[
          posterImageWidth ? posterImageWidth : 1080,
          posterImageHeight ? posterImageHeight : 1920,
        ]}
      />
      <posterPlaneShaderMate
        uTexture={posterImage}
        uResolution={[posterImageWidth, posterImageHeight]}
        uScale={[noiseScaleX, noiseScaleY]}
        ref={shader}
      />
    </mesh>
  );
}
