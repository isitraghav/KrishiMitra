<script>
  // import eruda from "eruda";
  // eruda.init();
  import { onMount } from "svelte";
  import { getDevice } from "framework7/lite-bundle";
  import { f7, f7ready, App, View } from "framework7-svelte";

  import capacitorApp from "../js/capacitor-app";
  import routes from "../js/routes";
  import store from "../js/store";

  const device = getDevice();
  // Framework7 Parameters
  let f7params = {
    name: "KrishiMitra", // App name
    theme: "ios", // Automatic theme detection
    colors: {
      primary: "#007aff",
    },
    darkMode: false,
    store: store,
    routes: routes,
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };

  onMount(() => {
    f7ready(() => {
      if (f7.device.capacitor) {
        capacitorApp.init(f7);
      }
    });
  });
</script>

<App {...f7params}>
  <!-- Your main view, should have "view-main" class -->
  <View main class="safe-areas" url="/" />
</App>
