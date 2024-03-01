package com.sociofy.tech.nyota;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.reactlibraryimagesmerge.ImagesMergePackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.microsoft.codepush.react.CodePush;
import com.airbnb.android.react.lottie.LottiePackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.swmansion.rnscreens.RNScreensPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
//import com.facebook.reactnative.androidsdk.FBSDKPackage;
// import com.sociofy.tech.nyota.sms.RNSmsRetrieverPackage;


import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      // packages.add(new RNSmsRetrieverPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
