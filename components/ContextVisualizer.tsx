import React, { useEffect, useRef, useState } from 'react';
import { UploadedFile } from '../types';

interface ContextVisualizerProps {
  files: UploadedFile[];
}

interface Point {
  x: number;
  y: number;
  z: number;
  file?: UploadedFile;
  color: string;
}

interface TransformedPoint extends Point {
  x2: number;
  y2: number;
  z2: number;
  scale: number;
  projectedX: number;
  projectedY: number;
}

export const ContextVisualizer: React.FC<ContextVisualizerProps> = ({ files }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0.2, y: 0.2 }); // Slight initial tilt
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  // Create points for the sphere
  const points = useRef<Point[]>([]);
  // Cache for loaded images
  const loadedImages = useRef<Record<string, HTMLImageElement>>({});

  // Preload images
  useEffect(() => {
    files.forEach(file => {
        if (file.type.startsWith('image/') && !loadedImages.current[file.id]) {
            const img = new Image();
            img.src = file.content;
            loadedImages.current[file.id] = img;
        }
    });
  }, [files]);

  useEffect(() => {
    // Initialize points - mixture of file points and decorative particles
    const newPoints: Point[] = [];
    const radius = 220; // Increased radius for better separation
    
    // Calculate total points needed. 
    // If we have files, we need at least that many points.
    // We add filler points to maintain the sphere shape, but reduce density if we have many files.
    const fillerCount = Math.max(50, 150 - files.length * 2); 
    const totalPoints = files.length + fillerCount;

    // Helper to distribute points on a sphere (Fibonacci Sphere)
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < totalPoints; i++) {
      const y = 1 - (i / (totalPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      
      const theta = phi * i; 
      
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Assign files to the points.
      // We distribute files evenly throughout the index range to prevent clumping if we just took the first N.
      // However, Fibonacci spiral naturally distributes well. 
      // Let's simply assign the first N indices to files for stability, 
      // but shuffle the 'file' assignment logic or just use the first N.
      // Using first N is fine for Fibonacci.
      
      const file = i < files.length ? files[i] : undefined;
      
      // Determine color based on file type or random for decoration
      let color = '#e5e7eb'; // default stone-200
      if (file) {
        if (file.type.includes('image')) color = '#ec4899'; // pink for images
        else if (file.type.includes('pdf')) color = '#ef4444'; // red for pdf
        else if (file.type.includes('text') || file.type.includes('html')) color = '#3b82f6'; // blue for text
        else color = '#10b981'; // green for others
      } else {
        // decorative particles
        color = Math.random() > 0.8 ? '#d1d5db' : '#f3f4f6';
      }

      newPoints.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        file,
        color
      });
    }
    points.current = newPoints;
  }, [files]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (!canvas || !containerRef.current) return;
      
      // Resize handling
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Calculate Positions & Transformations
      const transformedPoints: TransformedPoint[] = points.current.map(point => {
          // Rotate X
          let y = point.y * Math.cos(rotation.x) - point.z * Math.sin(rotation.x);
          let z = point.y * Math.sin(rotation.x) + point.z * Math.cos(rotation.x);
          let x = point.x;

          // Rotate Y
          let x2 = x * Math.cos(rotation.y) + z * Math.sin(rotation.y);
          let z2 = -x * Math.sin(rotation.y) + z * Math.cos(rotation.y);
          
          // Apply Zoom
          // Using a standard perspective projection
          const fov = 400;
          const scale = (zoom * fov) / (fov - z2);
          const projectedX = centerX + x2 * scale;
          const projectedY = centerY + y * scale;

          return {
              ...point,
              x2, y2: y, z2,
              scale,
              projectedX,
              projectedY
          };
      });

      // 2. Sort by Depth (z2) - Painters Algorithm (Draw furthest first)
      transformedPoints.sort((a, b) => a.z2 - b.z2);

      // 3. Render
      transformedPoints.forEach(p => {
        // Skip if behind camera too much (clipping)
        if (p.z2 > 350) return;

        // Determine size
        const isImage = p.file?.type.startsWith('image/');
        // Base radius: Images are larger (28px), File icons medium (10px), Dots small (2px)
        const baseRadius = isImage ? 28 : (p.file ? 10 : 2);
        const radius = Math.max(0.5, baseRadius * p.scale); 
        
        // Draw connections to center (subtle depth cue)
        if (p.file) {
           ctx.beginPath();
           ctx.moveTo(centerX, centerY);
           ctx.lineTo(p.projectedX, p.projectedY);
           // Fade out line based on depth
           const alpha = Math.max(0, 0.05 * (1 - (p.z2 + 200)/400)); 
           ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
           ctx.stroke();
        }

        // --- Draw Item ---
        
        if (isImage && p.file && loadedImages.current[p.file.id]) {
            // --- 3D Glass Sphere Effect for Images ---
            const r = radius;
            const px = p.projectedX;
            const py = p.projectedY;

            ctx.save();
            
            // Drop Shadow (scaled by depth)
            const shadowAlpha = Math.max(0, 0.2 * (1 - (p.z2 + 200)/500));
            ctx.shadowColor = `rgba(0,0,0,${shadowAlpha})`;
            ctx.shadowBlur = 15 * p.scale;
            ctx.shadowOffsetY = 8 * p.scale;

            // Base shape for clipping
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.closePath();
            
            ctx.save();
            ctx.clip(); // Clip everything to the sphere

            // Draw Image
            try {
                const img = loadedImages.current[p.file.id];
                // Draw slightly larger to cover antialiasing gaps
                ctx.drawImage(img, px - r, py - r, r * 2, r * 2);
            } catch(e) {
                ctx.fillStyle = '#f5f5f5';
                ctx.fill();
            }

            // Glass Overlay: Main Specular Highlight (Soft)
            const sheenGrad = ctx.createRadialGradient(px - r*0.3, py - r*0.3, r*0.1, px, py, r);
            sheenGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
            sheenGrad.addColorStop(0.5, 'rgba(255,255,255,0.0)');
            sheenGrad.addColorStop(1, 'rgba(0,0,0,0.1)'); 
            ctx.fillStyle = sheenGrad;
            ctx.fill();
            
            // Glass Overlay: Top Gloss (Sharp Reflection)
            ctx.beginPath();
            ctx.ellipse(px, py - r*0.5, r*0.6, r*0.3, 0, 0, Math.PI * 2);
            const glossGrad = ctx.createLinearGradient(px, py - r, px, py);
            glossGrad.addColorStop(0, 'rgba(255,255,255,0.5)');
            glossGrad.addColorStop(1, 'rgba(255,255,255,0.0)');
            ctx.fillStyle = glossGrad;
            ctx.fill();

            ctx.restore(); // Restore clip

            // Border / Rim Light
            ctx.shadowBlur = 0; // Reset shadow for border
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            
            // Linear gradient for border to simulate light direction
            const borderGrad = ctx.createLinearGradient(px - r, py - r, px + r, py + r);
            borderGrad.addColorStop(0, 'rgba(255,255,255,0.8)'); 
            borderGrad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
            borderGrad.addColorStop(1, 'rgba(255,255,255,0.05)'); 
            
            ctx.strokeStyle = borderGrad;
            ctx.lineWidth = Math.max(1, 1.5 * p.scale);
            ctx.stroke();

            ctx.restore();

        } else {
            // Standard Dot Rendering
            ctx.beginPath();
            ctx.arc(p.projectedX, p.projectedY, radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            
            if (p.file) {
                ctx.shadowBlur = 10 * p.scale;
                ctx.shadowColor = p.color;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.fill();
            ctx.shadowBlur = 0; // Reset
        }

        // Draw Label if it's a file and close enough to front
        // Only show label if z2 > 0 (front hemisphere) to reduce clutter
        if (p.file && p.z2 > -50) {
            ctx.fillStyle = `rgba(17, 24, 39, ${Math.min(1, (p.z2 + 100) / 200)})`; // Fade out label based on depth
            ctx.font = `500 ${Math.max(8, 11 * p.scale)}px "Plus Jakarta Sans"`;
            ctx.textAlign = 'center';
            // Truncate long names
            const name = p.file.name.length > 12 ? p.file.name.substring(0, 10) + '...' : p.file.name;
            // Draw label background for readability
            const textMetrics = ctx.measureText(name);
            const padding = 4 * p.scale;
            
            // Optional: Label Background
            // ctx.fillStyle = `rgba(255,255,255,${0.8 * Math.min(1, (p.z2 + 100) / 200)})`;
            // ctx.roundRect(
            //     p.projectedX - textMetrics.width/2 - padding, 
            //     p.projectedY + radius + 4*p.scale, 
            //     textMetrics.width + padding*2, 
            //     14*p.scale, 
            //     4
            // );
            // ctx.fill();

            ctx.fillStyle = `rgba(17, 24, 39, ${Math.min(1, (p.z2 + 100) / 200)})`;
            ctx.fillText(name, p.projectedX, p.projectedY + radius + 14 * p.scale);
        }
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [rotation, zoom, isDragging, files]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    
    setRotation(prev => ({
      x: prev.x - deltaY * 0.005, // Slower rotation speed for better control
      y: prev.y + deltaX * 0.005
    }));
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom control in 3D circle
    setZoom(prev => Math.max(0.5, Math.min(2.5, prev - e.deltaY * 0.001)));
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-move relative overflow-hidden bg-white rounded-3xl border border-stone-100 shadow-inner"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="block" />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-none">
         <div className="bg-white/80 backdrop-blur text-[10px] px-2 py-1 rounded-lg border border-stone-100 text-stone-500 shadow-sm">
            Drag to Rotate • Scroll to Zoom
         </div>
      </div>
    </div>
  );
};