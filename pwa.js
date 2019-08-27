var firebaseConfig = {
    apiKey: "AIzaSyCjNfFxxSJam9tsjNlzN09Da7Zhr8xOS3A",
    authDomain: "seyacolorpwa.firebaseapp.com",
    databaseURL: "https://seyacolorpwa.firebaseio.com",
    projectId: "seyacolorpwa",
    storageBucket: "",
    messagingSenderId: "65184438549",
    appId: "1:65184438549:web:ab7a022e62693a60"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//---Update the Push Notification Status---
function updatePushNotificationStatus(status) {
    pushNotification.dataset.checked = status;
    if (status) {
        notificationIndicator.classList.remove("fa-bell");
        notificationIndicator.classList.add("fa-bell-slash");
    } else {
        notificationIndicator.classList.remove("fa-bell-slash");
        notificationIndicator.classList.add("fa-bell");
    }
}
      
function checkIfPushIsEnabled() {
    //---check if push notification permission
    // has been denied by the user---
    if (Notification.permission === 'denied') {
        console.log('User has blocked push notification.');
        return;
    }
    //---check if push notification is
    // supported or not---
    if (!('PushManager' in window)) {
        console.log('Sorry, Push notification is not supported on this browser.');
        return;
    }
    //---get push notification subscription
    // if serviceWorker is registered and ready---
    navigator.serviceWorker.ready
    .then(function (registration) {
        registration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                //---user is currently subscribed to push---
                updatePushNotificationStatus(true);
            }
            else {
                //---user is not subscribed to push---
                updatePushNotificationStatus(false);
            }
        })
        .catch(function (error) {
            console.error( 'Error occurred enabling push ', error);
        });
    });
}
      
//---subscribe to push notification---
function subscribeToPushNotification() {
    navigator.serviceWorker.ready
    .then(function(registration) {
        if (!registration.pushManager) {
            console.log( 'This browser does not support push notification.');
            return false;
        }
        //---to subscribe push notification using
        // pushmanager---
        registration.pushManager.subscribe(
            //---always show notification when received---
            { userVisibleOnly: true }
        )
        .then(function (subscription) {
            var endpointSections = subscription.endpoint.split('/');
            var subscriptionId = endpointSections[endpointSections.length - 1];
            var newKey = firebase.database().ref().child('token').push().key;
            firebase.database().ref('token/' + newKey).set(
                {
                    subscriptionId: subscriptionId,
                    userID: userID,
                    customer_type: customer_type
                }
            );

            updatePushNotificationStatus(true);
            console.log('Push notification subscribed.' , subscription);
        })
        .catch(function (error) {
            updatePushNotificationStatus(false);
            console.error( 'Push notification subscription error: ', error);
        });
    })
}
      
//---unsubscribe from push notification---
function unsubscribeFromPushNotification() {
    navigator.serviceWorker.ready
    .then(function(registration) {
        registration.pushManager.getSubscription()
        .then(function (subscription) {
            if(!subscription) {
                console.log('Unable to unsubscribe from push notification.');
                return;
            }
            subscription.unsubscribe()
            .then(function () {
                console.log('Push notification unsubscribed.' , subscription);
                updatePushNotificationStatus(false);
            })
            .catch(function (error) {
                console.error(error);
            });
        })
        .catch(function (error) {
            console.error('Failed to unsubscribe push notification.');
        });
    })
}
      
//---get references to the UI elements---
var pushNotification = document.getElementById('pushNotification');
var notificationIndicator = document.getElementById('notificationIndicator');
      
//---event handler for the push button---
pushNotification.addEventListener('click', function () {
    //---check if you are already subscribed to push
    // notifications---
    if (pushNotification.dataset.checked === 'true') {
        unsubscribeFromPushNotification();
    } else {
        subscribeToPushNotification();
    }

    console.log(defferedPromt);
	if( defferedPromt ){
		defferedPromt.prompt();
		defferedPromt.userChoice.then(function(choiseResult){
			console.log(choiseResult.outcome);

			if( choiseResult.outcome == 'dissmissed' ){
				console.log('User cancelled installation');
			}else{
				console.log('User added to home screen');
			}
		});

		defferedPromt = null;
	}

});
      
//---check if push notification is supported---
checkIfPushIsEnabled();

let defferedPromt;
window.addEventListener('beforeinstallprompt', function(event) {
    console.log('beforeinstallprompt fired...');
	event.preventDefault();
	defferedPromt = event;
	return false;
});