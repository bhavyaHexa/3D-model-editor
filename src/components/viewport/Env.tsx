import { Environment, Lightformer } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { RGBELoader } from "three-stdlib";

import { useMainContext } from "../../context/MainContext";

export const Env = observer(() => {
  const defaultTexture = useLoader(RGBELoader, "/env/studio_small_09_2k.hdr");
  const { design3DManager } = useMainContext();
  const { envManager } = design3DManager;

  return (
    <Environment background={envManager.envVisibility}>
      <color attach="background" args={["black"]} />
      <mesh
        rotation={[
          envManager.envRotation.x,
          envManager.envRotation.y,
          envManager.envRotation.z,
        ]}
        scale={100}
      >
        <sphereGeometry />
        <meshBasicMaterial
          transparent
          opacity={envManager.envIntensity}
          map={envManager.environmentTexture || defaultTexture}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* LightFormers from all sides to prevent dark spots */}
      {/* Back */}
      <Lightformer
        form="rect"
        intensity={0.5}
        position={[0, 0, -5]}
        scale={[10, 10, 10]}
        target={[0, 0, 0]}
      />
      {/* Front */}
      <Lightformer
        form="rect"
        intensity={0.5}
        position={[0, 0, 5]}
        scale={[10, 10, 10]}
        target={[0, 0, 0]}
      />
      {/* Left */}
      <Lightformer
        form="rect"
        intensity={1}
        position={[-5, 0, 0]}
        scale={[10, 10, 10]}
        target={[0, 0, 0]}
      />
      {/* Right */}
      <Lightformer
        form="rect"
        intensity={0.5}
        position={[5, 0, 0]}
        scale={[10, 10, 10]}
        target={[0, 0, 0]}
      />
      {/* Top */}
      <Lightformer
        form="rect"
        intensity={0.8}
        position={[0, 5, 0]}
        scale={[10, 10, 10]}
        target={[0, 0, 0]}
      />
      {/* Bottom */}
      <Lightformer
        form="rect"
        intensity={0.2}
        position={[0, -5, 0]}
        scale={[10, 10, 10]}
        target={[0, 0, 0]}
      />
    </Environment>
  );
});
