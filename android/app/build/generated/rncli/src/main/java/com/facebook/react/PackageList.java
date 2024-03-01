
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @react-native-community/audio-toolkit
import com.reactnativecommunity.rctaudiotoolkit.AudioPackage;
// @react-native-community/blur
import com.cmcewen.blurview.BlurViewPackage;
// @react-native-community/clipboard
import com.reactnativecommunity.clipboard.ClipboardPackage;
// @react-native-community/datetimepicker
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// @react-native-community/progress-bar-android
import com.reactnativecommunity.androidprogressbar.RNCProgressBarPackage;
// @react-native-community/viewpager
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
// @react-native-community/voice
import com.wenkesj.voice.VoicePackage;
// @react-native-firebase/analytics
import io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/crashlytics
import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsPackage;
// @react-native-firebase/database
import io.invertase.firebase.database.ReactNativeFirebaseDatabasePackage;
// @react-native-firebase/dynamic-links
import io.invertase.firebase.dynamiclinks.ReactNativeFirebaseDynamicLinksPackage;
// @react-native-firebase/firestore
import io.invertase.firebase.firestore.ReactNativeFirebaseFirestorePackage;
// @react-native-firebase/in-app-messaging
import io.invertase.firebase.fiam.ReactNativeFirebaseFiamPackage;
// @react-native-firebase/messaging
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// @react-native-firebase/perf
import io.invertase.firebase.perf.ReactNativeFirebasePerfPackage;
// @react-native-firebase/remote-config
import io.invertase.firebase.config.ReactNativeFirebaseConfigPackage;
// @sentry/react-native
import io.sentry.react.RNSentryPackage;
// lottie-react-native
import com.airbnb.android.react.lottie.LottiePackage;
// react-native-camera
import org.reactnative.camera.RNCameraPackage;
// react-native-charts-wrapper
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
// react-native-code-push
import com.microsoft.codepush.react.CodePush;
// react-native-config
import com.lugg.RNCConfig.RNCConfigPackage;
// react-native-contacts
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-fbsdk
import com.facebook.reactnative.androidsdk.FBSDKPackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-image-crop-picker
import com.reactnative.ivpusic.imagepicker.PickerPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-localize
import com.reactcommunity.rnlocalize.RNLocalizePackage;
// react-native-permissions
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
// react-native-razorpay
import com.razorpay.rn.RazorpayPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-scratch
import com.como.RNTScratchView.ScratchViewPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-send-intent
import com.burnweb.rnsendintent.RNSendIntentPackage;
// react-native-share
import cl.json.RNSharePackage;
// react-native-sms-retriever-api
import com.reactlibrary.RNSmsRetrieverPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-text-input-mask
import com.RNTextInputMask.RNTextInputMaskPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-video
import com.brentvatne.react.ReactVideoPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;
// react-native-youtube
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
// rn-fetch-blob
import com.RNFetchBlob.RNFetchBlobPackage;
// rn-update-apk
import net.mikehardy.rnupdateapk.RNUpdateAPKPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new AudioPackage(),
      new BlurViewPackage(),
      new ClipboardPackage(),
      new RNDateTimePickerPackage(),
      new GeolocationPackage(),
      new NetInfoPackage(),
      new RNCProgressBarPackage(),
      new RNCViewPagerPackage(),
      new VoicePackage(),
      new ReactNativeFirebaseAnalyticsPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseCrashlyticsPackage(),
      new ReactNativeFirebaseDatabasePackage(),
      new ReactNativeFirebaseDynamicLinksPackage(),
      new ReactNativeFirebaseFirestorePackage(),
      new ReactNativeFirebaseFiamPackage(),
      new ReactNativeFirebaseMessagingPackage(),
      new ReactNativeFirebasePerfPackage(),
      new ReactNativeFirebaseConfigPackage(),
      new RNSentryPackage(),
      new LottiePackage(),
      new RNCameraPackage(),
      new MPAndroidChartPackage(),
      new CodePush(getResources().getString(com.sociofy.tech.nyota.R.string.CodePushDeploymentKey), getApplicationContext(), com.sociofy.tech.nyota.BuildConfig.DEBUG),
      new RNCConfigPackage(),
      new ReactNativeContacts(),
      new RNDeviceInfo(),
      new FBSDKPackage(),
      new RNFSPackage(),
      new RNGestureHandlerPackage(),
      new PickerPackage(),
      new LinearGradientPackage(),
      new RNLocalizePackage(),
      new RNPermissionsPackage(),
      new RazorpayPackage(),
      new ReanimatedPackage(),
      new ScratchViewPackage(),
      new RNScreensPackage(),
      new RNSendIntentPackage(),
      new RNSharePackage(),
      new RNSmsRetrieverPackage(),
      new SvgPackage(),
      new RNTextInputMaskPackage(),
      new VectorIconsPackage(),
      new ReactVideoPackage(),
      new RNCWebViewPackage(),
      new ReactNativeYouTube(),
      new RNFetchBlobPackage(),
      new RNUpdateAPKPackage()
    ));
  }
}
