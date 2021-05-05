package com.brainyapps.gamenightspadez;

import android.content.Context;
import androidx.multidex.MultiDexApplication;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

// Add For Firebase Integration
/* import io.invertase.firebase.storage.ReactNativeFirebaseStoragePackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import io.invertase.firebase.firestore.ReactNativeFirebaseFirestorePackage;
import io.invertase.firebase.auth.ReactNativeFirebaseAuthPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
///import io.invertase.firebase.dynamiclinks.ReactNativeFirebaseDynamicLinksPackage; */

// import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
// import io.invertase.firebase.firestore.RNFirebaseFirestorePackage; // <-- Add this line
// import io.invertase.firebase.auth.RNFirebaseAuthPackage; // <-- Add this line
// import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- Add this line
// import io.invertase.firebase.storage.RNFirebaseStoragePackage; // <-- Add this line

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
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

          // Add For Firebase Linking
          /*packages.add(new ReactNativeFirebaseAppPackage());
          packages.add(new ReactNativeFirebaseAuthPackage());
          packages.add(new ReactNativeFirebaseMessagingPackage());
          packages.add(new ReactNativeFirebaseFirestorePackage());
          packages.add(new ReactNativeFirebaseStoragePackage());*/
          ///packages.add(new ReactNativeFirebaseDynamicLinksPackage());

          // packages.add(new RNFirebaseMessagingPackage());
          // packages.add(new RNFirebaseFirestorePackage());
          // packages.add(new RNFirebaseAuthPackage());
          // packages.add(new RNFirebaseNotificationsPackage());
          // packages.add(new RNFirebaseStoragePackage());


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
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
