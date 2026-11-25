import type {ThreeElements} from '@react-three/fiber';

// expose r3f intrinsic elements (group, mesh, materials…) to the react-jsx runtime types
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
