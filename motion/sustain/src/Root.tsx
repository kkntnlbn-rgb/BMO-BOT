import React from 'react';
import {Composition} from 'remotion';
import {Main, TOTAL} from './Main';
import {FPS, H, W} from './theme';
import {defaults, schema} from './config';
import {BottleSpin} from './three/BottleSpin';

/* `npm run studio` → "Sustain" → edit everything in the Props panel. */
export const Root: React.FC = () => (
  <>
    <Composition id="Sustain" component={Main} schema={schema} defaultProps={defaults} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    {/* pre-render once: npx remotion render BottleSpin --sequence --image-format=png public/bottle --gl=angle */}
    <Composition id="BottleSpin" component={BottleSpin} durationInFrames={240} fps={FPS} width={600} height={1000} />
  </>
);
