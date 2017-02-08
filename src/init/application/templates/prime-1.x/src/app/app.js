
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        // Here we register our callbacks for the lifecycle events we care about
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
        document.addEventListener('backbutton', this.onBackButtonPressed);

    },
    onBackButtonPressed:function(){
        console.log('onBackButtonPressed');
        if(window.history.length <= 1){
            navigator.app.exitApp();
        }
    },
    onDeviceReady: function() {
        console.log('onDeviceReady');
        
    },
    onPause: function() {
        // Here, we check to see if we are in the middle of taking a picture. If
        // so, we want to save our state so that we can properly retrieve the
        // plugin result in onResume(). We also save if we have already fetched
        // an image URI
        console.log('onPause');
    },
    onResume: function(event) {
        // Here we check for stored state and restore it if necessary. In your
        // application, it's up to you to keep track of where any pending plugin
        // results are coming from (i.e. what part of your code made the call)
        // and what arguments you provided to the plugin if relevant
        console.log('onResume');
    }
}

app.initialize();