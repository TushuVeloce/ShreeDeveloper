import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shreedeveloper.app',
  appName: 'Shree Developer',
  webDir: 'www',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    Keyboard: {
      resize: 'ionic' // Valid values: 'none', 'native', 'body', 'ionic'
    }
  }
};

export default config;
