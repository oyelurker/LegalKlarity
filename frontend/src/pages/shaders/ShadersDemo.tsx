import DemoOne from '../../components/ui/demo';
import { ShaderPlane, EnergyRing } from '../../components/ui/background-paper-shaders';
import { Canvas } from '@react-three/fiber';

const ShadersDemo = () => {
  return (
    <div className="w-full h-screen relative">
      {/* Demo component with background effects */}
      <DemoOne />
      
      {/* 3D Canvas with shader components */}
      <div className="absolute bottom-8 left-8 z-10 bg-black/30 backdrop-blur-sm p-4 rounded-lg">
        <h2 className="text-white text-lg font-bold mb-2">3D Shader Components</h2>
        <div className="w-64 h-64">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <ShaderPlane position={[0, 0, 0]} color1="#6366f1" color2="#8b5cf6" />
            <EnergyRing radius={1.5} position={[0, 1.5, 0]} />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default ShadersDemo;