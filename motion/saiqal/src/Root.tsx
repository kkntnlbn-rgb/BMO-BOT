import React from 'react';
import {Composition} from 'remotion';
import {Saiqal, TOTAL} from './Saiqal';
import {FPS, H, W} from './theme';

export const Root: React.FC = () => (
  <Composition
    id="Saiqal"
    component={Saiqal}
    durationInFrames={TOTAL}
    fps={FPS}
    width={W}
    height={H}
    // Put your own licensed photo in public/ and pass e.g. staticFile('portrait.jpg')
    defaultProps={{portrait: null}}
  />
);
