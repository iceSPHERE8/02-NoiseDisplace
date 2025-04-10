import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useControls, button } from "leva";

import waveVertexShader from "./shaders/wave/vertex.glsl";
import waveFragmentShader from "./shaders/wave/fragment.glsl";

const PosterPlaneShaderMate = shaderMaterial(
  {
    uTexture: null,
    uResolution: new THREE.Vector2(1080, 1920),
    uTime: 0,
    uScale: new THREE.Vector2(1, 1),
    uStrength: 0,
    uOffset: 0,
    uNoise: 0
  },
  waveVertexShader,
  waveFragmentShader
);

extend({ PosterPlaneShaderMate });

export default function PosterPlane() {
  const [posterImage, setPosterImage] = useState(null);
  const defaultTexture = useTexture("../../poster.jpg");


  let isRecording = false;
  const recorderRef = useRef();
  const { gl, scene, camera } = useThree();

  /**
   * GUI Parameters
   */
  const { poster, speed, noiseScaleX, noiseScaleY, displaceStrength, offset, noiseLevel } = useControls({
    poster: {
      image: undefined,
      label: "图片文件"
    },
    speed: {
      value: 1,
      min: 0,
      max: 10,
      step: 0.01,
      label: "动画速度"
    },
    noiseScaleX: {
      value: 1,
      min: 0,
      max: 10,
      step: 0.001,
      label: "噪声尺寸-X"
    },
    noiseScaleY: {
      value: 1,
      min: 0,
      max: 10,
      step: 0.001,
      label: "噪声尺寸-Y"
    },
    displaceStrength: {
      value: 0.5,
      min: 0, 
      max: 1,
      step: 0.001,
      label: "置换强度"
    },
    offset: {
      value: 0,
      min: 0, 
      max: 10,
      step: 0.001,
      label: "噪声偏移"
    },
    noiseLevel: {
      value: 0.5,
      min: 0, 
      max: 10,
      step: 0.001,
      label: "噪声等级"
    },
    Save: button(() => {
        gl.render(scene, camera); 
        const dataUrl = gl.domElement.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "poster-snapshot.png";
        link.click();
      }),
    Record: button(() => {
      
      if (isRecording === false) {
        const stream = gl.domElement.captureStream(60);
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        recorderRef.current = recorder;
        const chunks = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "poster-video.webm";
          link.click();
          URL.revokeObjectURL(url);
        };

        recorder.start();
        isRecording = true;
        console.log("Recording started", isRecording);
      } else {
        recorderRef.current.stop();
        isRecording = false;
        console.log("Recording stopped");
      }
    })
  })

  useEffect(() => {
    if (poster) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(poster, (texture) => {
        texture.needsUpdate = true;
        setPosterImage(texture);
        console.log("Poster image updated:", texture);
      });
    } else {
      setPosterImage(defaultTexture);
    }
  }, [poster, defaultTexture]);

  const posterImageWidth = posterImage?.image?.width || 1080;
  const posterImageHeight = posterImage?.image?.height || 1920;

  const shader = useRef();
  // console.log(shader.current.uniforms)

  useFrame((state) => {
    shader.current.uniforms.uTime.value = state.clock.elapsedTime * speed;
    shader.current.uniforms.uScale.value = new THREE.Vector2(noiseScaleX, noiseScaleY);
    shader.current.uniforms.uStrength.value = displaceStrength;
    shader.current.uniforms.uOffset.value = offset;
    shader.current.uniforms.uNoise.value = noiseLevel;
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
        uTexture={posterImage || defaultTexture}
        uResolution={[posterImageWidth, posterImageHeight]}
        uScale={[noiseScaleX, noiseScaleY]}
        ref={shader}
      />
    </mesh>
  );
}
