
import { useEffect, useRef } from "react";

interface DisciplineGlobeProps {
  disciplines: string[];
}

export const DisciplineGlobe = ({ disciplines }: DisciplineGlobeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateSize = () => {
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Globe visualization variables
    let radius = Math.min(canvas.width, canvas.height) / 3;
    const nodes: {
      text: string;
      size: number;
      color: string;
      x: number;
      y: number;
      z: number;
      speed: number;
    }[] = [];
    
    // Create nodes for each discipline
    disciplines.forEach((discipline) => {
      // Random positioning on a sphere
      const phi = Math.acos(-1 + Math.random() * 2);
      const theta = Math.random() * 2 * Math.PI;
      
      nodes.push({
        text: discipline,
        size: Math.random() * 5 + 10, // Random size
        color: `hsl(${Math.random() * 360}, 70%, 60%)`, // Random color
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        speed: (Math.random() - 0.5) * 0.002 // Random rotation speed
      });
    });
    
    let angle = 0;
    
    // Animation function
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sort nodes by z-index for proper rendering
      const sortedNodes = [...nodes].sort((a, b) => a.z - b.z);
      
      // Update and draw each node
      sortedNodes.forEach(node => {
        // Rotate around Y axis
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        const x = node.x * cosAngle - node.z * sinAngle;
        const z = node.z * cosAngle + node.x * sinAngle;
        node.x = x;
        node.z = z;
        
        // Calculate opacity based on z position (depth)
        const opacity = (node.z + radius) / (2 * radius);
        const scale = (node.z + radius) / (2 * radius);
        
        // Draw the node
        ctx.save();
        ctx.globalAlpha = 0.7 * opacity;
        ctx.fillStyle = node.color;
        ctx.font = `${node.size * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(
          node.text, 
          canvas.width / 2 + node.x, 
          canvas.height / 2 + node.y
        );
        ctx.restore();
      });
      
      angle += 0.005; // Rotation speed
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [disciplines]);
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-80 relative rounded-lg overflow-hidden bg-gradient-to-b from-[#1A1A1A] to-[#000000]"
    >
      <canvas ref={canvasRef} className="absolute inset-0"></canvas>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#0e0e0e] opacity-60"></div>
      <div className="absolute bottom-6 left-0 right-0 text-center text-white font-medium">
        <span className="bg-[#1A1A1A] px-4 py-1.5 rounded-full text-sm">
          Explore the Spheres of Knowledge
        </span>
      </div>
    </div>
  );
};
