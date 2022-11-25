$(function () {
  let userId;
  let apiKey;
  const notification = new bootstrap.Toast($("#notification"));
  const errorToast = new bootstrap.Toast($("#error"));
  const authorizationModal = new bootstrap.Modal("#authorizationModal");
  const params = new URLSearchParams(window.location.search);

  function init() {
    $("#userId").val(params.get("user_id"));
    $("#apiKey").val(params.get("api_key"));
    saveConfig();

    if (params.has("authorization_successful")) {
      authorizationModal.show();
    }
  }

  function showNotification(text) {
    $("#notificationMessage").text(text);
    notification.show();
  }

  function showError(text) {
    $("#errorMessage").text(JSON.stringify(text));
    errorToast.show();
  }

  function saveConfig() {
    const newUserId = $("#userId").val();
    const newApiKey = $("#apiKey").val();
    if (newUserId !== userId || newApiKey !== apiKey) {
      userId = newUserId;
      apiKey = newApiKey;
      showNotification(`API Key & User ID ${userId} is saved`);
    }
  }

  function debounce(callback, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callback.apply(this, args);
      }, wait);
    };
  }

  // EVENTS LISTENER
  $("form").submit((event) => {
    event.preventDefault();
  });

  $("#configForm").focusout(() => {
    saveConfig();
  });
  $("#configForm input").keyup(
    debounce(() => {
      saveConfig();
      // 3 second after keyup
    }, 3000)
  );

  $("#save").click(() => {
    saveConfig();
  });

  $("#authorize").click(async () => {
    saveConfig();
    const callbackParams = new URLSearchParams({
      user_id: userId,
      api_key: apiKey,
      authorization_successful: true
    });
    const callbackUrl = `${window.location.origin}${
      window.location.pathname
    }?${callbackParams.toString()}`;


    const params = new URLSearchParams({
      user_id: userId,
      callback_url: callbackUrl
    });
    const url = `/shopee/auth/get_oauth_url?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
      },
    });

    const data = await response.json();

    if (response.ok) {
      const url = data.url;
      window.open(url, "_blank");
    } else {
      showError(data);
    }
  });

  init();
});
