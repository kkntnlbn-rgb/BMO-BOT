import React from 'react';
import { Composition } from 'remotion';
import { DarFilm } from './DarFilm';
import { VIDEO_CONFIG } from './styles/tokens';

export const RemotionRoot: React.FC = () => (
  <Composition id="DarBrandFilm" component={DarFilm} width={VIDEO_CONFIG.width} height={VIDEO_CONFIG.height}
    fps={VIDEO_CONFIG.fps} durationInFrames={VIDEO_CONFIG.durationInFrames} />
);
