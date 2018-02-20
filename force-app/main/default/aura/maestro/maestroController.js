({
    init: function (component, event, helper) {
      helper.loadOrchestrationNames(component);


      component.set('v.cometdSubscriptions', []);
  	  component.set('v.notifications', []);

	  // Disconnect CometD when leaving page
	  window.addEventListener('unload', function(event) {
	    helper.disconnectCometd(component);
	  });
	  // Retrieve session id
	  var action = component.get('c.getSessionId');
	  action.setCallback(this, function(response) {
	    if (component.isValid() && response.getState() === 'SUCCESS') {
	      component.set('v.sessionId', response.getReturnValue());
	      if (component.get('v.cometd') != null)
	        helper.connectCometd(component);
	    }
	    else
	      console.error(response);
	  });
	  $A.enqueueAction(action);

  	  //helper.displayToast(component, 'success', 'Ready to receive notifications.');

    },

    onCometdLoaded : function(component, event, helper) {
	  var cometd = new org.cometd.CometD();
	  component.set('v.cometd', cometd);
	  if (component.get('v.sessionId') != null)
	    helper.connectCometd(component);
	},



    handleOrchestrationSelection: function (cmp, event, helper) {

        var orchestrationName = cmp.get('v.selectedOrchestrationName');
        var orchestrationNames = cmp.get('v.orchestrationNames');
        //If we had at least one existing strategy at an empty option is still in the beginning of the list, we remove it
        //so it can no longer be selected
        if (orchestrationNames && orchestrationNames.length > 0 && orchestrationNames[0] === '') {
            orchestrationNames = orchestrationNames.slice(1);
            cmp.set('v.orchestrationNames', orchestrationNames);
        }

        helper.loadOrchestration(cmp, orchestrationName);
    },



	handleMenuSelect: function (cmp, event, helper) {
        var selectedMenuItemValue = event.getParam('value');
        switch (selectedMenuItemValue) {
            case 'newOrchestration':
                alert('This functionality is not implemented yet');
                break;
            case 'saveOrchestration':
                alert('This functionality is not implemented yet');
                break;
            case 'addElement':
                alert('This functionality is not implemented yet');
                break;
        }
    }




})
