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
     resize: 'body' // options: 'body', 'ionic', 'native', 'none'
    }
  }
};

export default config;
