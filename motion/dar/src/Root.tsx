import React from 'react';
import {Composition} from 'remotion';
import {Film, TOTAL} from './Film';
import {FPS, H, W} from './theme';

export const Root: React.FC = () => <Composition id="Dar" component={Film} defaultProps={{blur: 5}} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />;
