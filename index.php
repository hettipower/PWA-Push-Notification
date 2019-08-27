<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>PWA</title>
  <!-- PWA Interigation -->
  <link rel="manifest" href="<?php echo base_url(); ?>manifest.json">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="#21439c">
  <meta name="apple-mobile-web-app-title" content="Seyacolor">
  <link rel="apple-touch-icon" href="<?php echo base_url(); ?>assets/images/app/logo512.png">
  <meta name="description" content="Sri Lankas first state of the art Online album design platform">
  <meta name="theme-color" content="#21439c" />
  <!-- The core Firebase JS SDK is always required and must be listed first -->
  <script src="https://www.gstatic.com/firebasejs/6.4.2/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/6.4.2/firebase-database.js"></script>
  <style>
    #pushNotification {
      position: fixed;
      z-index: 10000;
      bottom: 2rem;
      right: 2rem;
      cursor: pointer;
      background-color: #f12f2f;
      color: #fff;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 45px;
      height: 45px;
      border-radius: 100%;
    }
  </style>
</head>
<body>


<div id="pushNotification">
  <i id="notificationIndicator" class="fas fa-bell"></i>
</div>
<script>
if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');
    navigator.serviceWorker.register('<?php echo base_url(); ?>service-worker.js')
        .then(function(swReg) {
            console.log('Service Worker is registered', swReg);
            swRegistration = swReg;
        })
        .catch(function(error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');
}
</script>
<script src="./pwa.js"></script>
</body>
</html>