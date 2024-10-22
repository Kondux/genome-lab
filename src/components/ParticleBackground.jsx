import React, { useCallback, useEffect, useMemo } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticleBackground = React.memo(({ color }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  useEffect(() => {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
      window.pJSDom[0].pJS.particles.color.value = color;
      window.pJSDom[0].pJS.particles.line_linked.color = color;
      window.pJSDom[0].pJS.fn.particlesRefresh();
    }
  }, [color]);

  const options = useMemo(() => ({
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: color },
      shape: {
        type: ["circle"],
        stroke: { width: 1, color: color },
        polygon: { nb_sides: 6 },
        star: { nb_sides: 5, inset: 2 }
      },
      opacity: { 
        value: 0.7, 
        random: true, 
        anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } 
      },
      size: { 
        value: 6, 
        random: true, 
        anim: { enable: true, speed: 4, size_min: 1, sync: false } 
      },
      line_linked: { 
        enable: true, 
        distance: 150, 
        color: color, 
        opacity: 0.4, 
        width: 1,
        triangles: { enable: true, opacity: 0.1 }
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: { enable: true, rotateX: 600, rotateY: 1200 }
      },
      twist: {
        enable: true,
        clockwise: true,
        speed: 5
      },
      wobble: {
        enable: true,
        distance: 10,
        speed: 5
      },
      glow: {
        enable: true,
        color: color,
        radius: 10
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: false },
        onclick: { enable: false },
        resize: true
      },
    },
    retina_detect: true,
    background: {
      color: "#000000",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    },
    particles_trail: {
      enable: true,
      length: 10,
      opacity: 0.3
    }
  }), [color]);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
    />
  );
});

export default ParticleBackground;
