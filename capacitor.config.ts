import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shreedeveloper.app',
  appName: 'Shree Developer',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#000000"
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
     Keyboard: {
      resize: "body" 
    }
  }
};

export default config;
