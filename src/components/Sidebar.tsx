
import React, { useEffect, useRef } from 'react';

const Sidebar: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    
    const scriptUrl = "//anniversaryvacuumambassador.com/184feb0cd95bdf3d09c7ab46b417e225/invoke.js";
    
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    
    if (containerRef.current) {
        containerRef.current.appendChild(script);
        scriptLoaded.current = true;
    }
  }, []);

  return (
    <div className="w-full flex justify-center min-h-[600px]">
        <div id="container-184feb0cd95bdf3d09c7ab46b417e225" ref={containerRef} className="w-full flex justify-center"></div>
    </div>
  );
};

export default Sidebar;
