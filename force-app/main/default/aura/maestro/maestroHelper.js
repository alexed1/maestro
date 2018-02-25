({
   //Populates the select orchestration drop down
  loadOrchestrationNames: function (cmp) {
    var action = cmp.get('c.getOrchestrationNames');
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        //If we got at least one orchestration, we add an empty name in the beginning of the list, so no orchestration is selected by default
        var orchestrations = response.getReturnValue();
        if (!orchestrations || orchestrations.length === 0) {
          cmp.set('v.orchestrationNames', []);
        }
        else {
          cmp.set('v.orchestrationNames', [''].concat(orchestrations));
        }
      }
      else {
        console.log('Failed with state: ' + state);
      }
    });
    $A.enqueueAction(action);
  },

  //when an Orchestration is selected, load data from its Salesforce record
  loadOrchestration: function (cmp, orchestrationName) {
    self = this;
    var action = cmp.get("c.loadOrchestration");

    action.setParams({ name: orchestrationName });
    // Add callback behavior for when response is received
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var orchestrationRecord = response.getReturnValue();
        cmp.set('v.curOrch', orchestrationRecord);
        // var orchestrationId = response.getReturnValue().Id;
        // cmp.set('v.orchestrationId', orchestrationId);
        console.log('returning orchestration Id: ' + orchestrationRecord.Id);

        self.renderDashboard(cmp);
      }
      else {
        console.log("Failed with state: " + state);
      }

    });
    // Send action off to be executed
    $A.enqueueAction(action);
  },

  renderDashboard: function (cmp) {
  	self = this;
  	var curOrch = cmp.get('v.curOrch');
  	curOrch.members.forEach(function(member) {
  		 self.createControl(cmp, member);
  	})

  },

    
    //dynamic injection is code efficient, encourages encapsulation, and allows custom ordering of the elements
   createControl : function(cmp,member) {
        
        //then create the child component     
        $A.createComponent(
            "c:orchMember",
            {
             "label": member.label,
             "status": member.status,  
  			 },
            
            function(newCmp) {
                if(cmp.isValid()){
                    var body = cmp.get("v.body");
                    body.push(newCmp);
                    cmp.set("v.body", body);
                }
            });
    },


  connectCometd : function(component) {
    var helper = this;

    // Configure CometD
    var cometdUrl = window.location.protocol+'//'+window.location.hostname+'/cometd/40.0/';
    var cometd = component.get('v.cometd');
    cometd.configure({
      url: cometdUrl,
      requestHeaders: { Authorization: 'OAuth '+ component.get('v.sessionId')},
      appendMessageTypeToURL : false
    });
    cometd.websocketEnabled = false;

    // Establish CometD connection
    console.log('Connecting to CometD: '+ cometdUrl);
    cometd.handshake(function(handshakeReply) {
      if (handshakeReply.successful) {
        console.log('Connected to CometD.');
        // Subscribe to platform event
        var newSubscription = cometd.subscribe('/event/OrchestrationStatusUpdate__e',
          function(platformEvent) {
            console.log('Platform event received: '+ JSON.stringify(platformEvent));
            helper.onReceiveNotification(component, platformEvent);
          }
        );
        // Save subscription for later
        var subscriptions = component.get('v.cometdSubscriptions');
        subscriptions.push(newSubscription);
        component.set('v.cometdSubscriptions', subscriptions);
      }
      else
        console.error('Failed to connected to CometD.');
    });
  },

  disconnectCometd : function(component) {
  	var helper = this;
    var cometd = component.get('v.cometd');

    // Unsuscribe all CometD subscriptions
    cometd.batch(function() {
      var subscriptions = component.get('v.cometdSubscriptions');
      subscriptions.forEach(function (subscription) {
        cometd.unsubscribe(subscription);
      });
    });
    component.set('v.cometdSubscriptions', []);

    // Disconnect CometD
    cometd.disconnect();
    console.log('CometD disconnected.');
    //helper.connectCometd(component);
  },

  onReceiveNotification : function(component, platformEvent) {
    var helper = this;
    // Extract notification from platform event
    var newNotification = {
      time : $A.localizationService.formatDateTime(
        platformEvent.data.payload.CreatedDate, 'HH:mm'),
      message : platformEvent.data.payload.Label__c + platformEvent.data.payload.Status__c
    };
    // Save notification in history
    var notifications = component.get('v.notifications');
    notifications.push(newNotification);
    component.set('v.notifications', notifications);
    // Display notification in a toast if not muted
    if (!component.get('v.isMuted'))
      //helper.displayToast(component, 'info', newNotification.message);
      helper.updateLogstream(component, platformEvent.data.payload);
  	//helper.disconnectCometd(component);

  },

  updateLogstream : function(cmp, eventData) {
    var logstream = cmp.get("v.logStream");
    var updateLine= eventData.Label__c + " " + eventData.Record_Name__c + " " + eventData.Record_ID__c;
    logstream.unshift(updateLine);
    cmp.set("v.logStream", logstream);

  },

  displayToast : function(component, type, message) {
    var toastEvent = $A.get('e.force:showToast');
    toastEvent.setParams({
      type: type,
      message: message
    });
    toastEvent.fire();
  }

})
