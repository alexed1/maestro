({
    init: function (cmp, event, helper) {
        helper.loadOrchestrationNames(cmp);

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
    },

})
