({
    handleClick : function(cmp, event, helper) {	
        var navEvt = $A.get("e.force:navigateToSObject");
        var url = "https://electronmotors.lightning.force.com/one/one.app#/sObject/a4LB00000000El6MAE";
        window.open(url,'_blank');
        navEvt.setParams({
          "recordId": event.getSource().get("v.name")
        });
        //navEvt.fire();
        },
    
    navigateToRecord : function(component , event, helper){
    	window.open('/' + event.getParam('recordId'));  
        event.stopPropagation();
	},
})