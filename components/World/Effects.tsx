
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useThree } from '@react-three/fiber';

export const Effects: React.FC = () => {
  const { size } = useThree();
  const isMobile = size.width / size.height < 1.2 || size.width < 768;

  // Skip heavy effects on mobile for better performance
  if (isMobile) {
    return null; // NO POST-PROCESSING ON MOBILE
  }

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      {/* Tighter bloom to avoid fog: High threshold, moderate radius */}
      <Bloom
        luminanceThreshold={0.75}
        mipmapBlur
        intensity={1.0}
        radius={0.6}
        levels={6}
      />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  );
};
