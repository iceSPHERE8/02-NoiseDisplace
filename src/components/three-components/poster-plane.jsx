import * as THREE from "three";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

import waveVertexShader from "./shaders/wave/vertex.glsl";
import waveFragmentShader from "./shaders/wave/fragment.glsl";

const PosterPlaneShaderMate = shaderMaterial(
  {
    uTexture: null,
    uResolution: new THREE.Vector2(1080, 1920),
  },
  waveVertexShader,
  waveFragmentShader
);

extend({ PosterPlaneShaderMate });

export default function PosterPlane() {
  const posterImage = useTexture("../../poster.jpg");
  const posterImageWidth = posterImage.image.width;
  const posterImageHeight = posterImage.image.height;

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
      />
    </mesh>
  );
}
