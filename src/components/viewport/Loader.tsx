import { Html } from "@react-three/drei";

export function Loader() {
  return (
    <Html center>
      <div className="text-gray-800 font-medium px-4 py-2 bg-white/80 rounded-md shadow-sm backdrop-blur-sm whitespace-nowrap">
        Loading ..
      </div>
    </Html>
  );
}
