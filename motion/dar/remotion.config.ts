import {Config} from '@remotion/cli/config';
Config.setEntryPoint('./src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell');
