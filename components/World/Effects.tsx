
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export const Effects: React.FC = () => {
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      {/* Tighter bloom to avoid fog: High threshold, moderate radius */}
      <Bloom 
        luminanceThreshold={0.75} 
        mipmapBlur 
        intensity={1.0} 
        radius={0.6}
        levels={6} // Reduced levels for performance
      />
      {/* Removed Noise for performance on mobile */}
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  );
};
