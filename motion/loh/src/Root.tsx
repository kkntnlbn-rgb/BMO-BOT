import React from 'react';
import {Composition} from 'remotion';
import {Loh, TOTAL} from './Loh';
import {FPS, H, W} from './theme';
import {defaults, schema} from './config';

/* Open with `npm run studio` → select "LOH" → edit everything in the Props panel on the right. */
export const Root: React.FC = () => (
  <Composition id="LOH" component={Loh} schema={schema} defaultProps={defaults} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
