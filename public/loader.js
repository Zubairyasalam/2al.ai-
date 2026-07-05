/**
 * 2all.ai Accessibility Widget Loader
 * Version: 2.0.0
 * Lightweight bootstrap snippet for dynamic accessibility widget injection.
 */
(function () {
  if (window.__2ALL_WIDGET_LOADED__) return;
  window.__2ALL_WIDGET_LOADED__ = true;

  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

  if (!currentScript) {
    console.error("[2all.ai] Could not identify loader script element.");
    return;
  }

  var apiKey = currentScript.getAttribute("data-api-key");
  var domain = currentScript.getAttribute("data-domain") || window.location.hostname;
  var apiUrl = currentScript.getAttribute("data-api-url");

  if (!apiUrl) {
    if (currentScript.src && currentScript.src.indexOf("http") === 0) {
      var urlParts = currentScript.src.split("/");
      apiUrl = urlParts[0] + "//" + urlParts[2];
    } else {
      apiUrl = "";
    }
  }

  if (!apiKey) {
    console.warn("[2all.ai] Missing data-api-key attribute on loader script.");
    return;
  }

  var bootstrapUrl =
    apiUrl +
    "/api/widget/bootstrap?apiKey=" +
    encodeURIComponent(apiKey) +
    "&domain=" +
    encodeURIComponent(domain) +
    "&url=" +
    encodeURIComponent(window.location.href);

  var xhr = new XMLHttpRequest();
  xhr.open("GET", bootstrapUrl, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var res = JSON.parse(xhr.responseText);
          if (res.success) {
            window.__2ALL_CONFIG__ = res.config || {};
            window.__2ALL_TENANT__ = res.tenantId;
            window.__2ALL_DOMAIN__ = res.domain;

            if (res.overageWarning && res.overageMessage) {
              console.warn("[2all.ai Quota Warning]", res.overageMessage);
            }

            // Inject Core Engine
            var coreScript = document.createElement("script");
            coreScript.src = apiUrl + (res.scriptUrl || "/widget-core.js");
            coreScript.async = true;
            coreScript.onerror = function () {
              console.error("[2all.ai] Failed to load widget core bundle.");
            };
            (document.head || document.body).appendChild(coreScript);
          } else {
            console.error("[2all.ai Widget Error]", res.message || res.error);
          }
        } catch (e) {
          console.error("[2all.ai] Failed to parse bootstrap response.", e);
        }
      } else {
        console.error("[2all.ai] Bootstrap request failed with status: " + xhr.status);
      }
    }
  };
  xhr.send();
})();
