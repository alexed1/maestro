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

       
      }
      else {
        console.log("Failed with state: " + state);
      }

    });
    // Send action off to be executed
    $A.enqueueAction(action);
  },



})
