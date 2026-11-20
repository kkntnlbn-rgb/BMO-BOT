import React from 'react';
import {Composition} from 'remotion';
import {Loh, TOTAL} from './Loh';
import {FPS, H, W} from './theme';

export const Root: React.FC = () => <Composition id="LOH" component={Loh} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />;
