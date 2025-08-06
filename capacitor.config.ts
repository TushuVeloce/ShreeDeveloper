import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.shreedeveloper.app',
  appName: 'Shree Developer',
  webDir: 'www',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    Keyboard: {
      resize: KeyboardResize.Body // Valid values: 'none', 'native', 'body', 'ionic'
    }
  }
};

export default config;
