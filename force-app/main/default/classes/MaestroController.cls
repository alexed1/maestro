public with sharing class MaestroController {
    public MaestroController() {

    }

    @AuraEnabled
    public static String getSessionId() {
      return UserInfo.getSessionId();
    }


    @AuraEnabled
    public static List<String> getOrchestrationNames() {
        List<Orchestration__c> curOrchestrations =
        		 [SELECT  Label__c 
                FROM Orchestration__c];
        List<String> orchestrationNames = new List<String>();
        for (Orchestration__c curOrch : curOrchestrations) {
   				orchestrationNames.add(curOrch.Label__c);
			}

		System.debug('orchestrationNames:' + orchestrationNames);
		System.debug('curOrchestrations:' + curOrchestrations);
		return orchestrationNames;
    }

    @AuraEnabled
    public static Orchestration loadOrchestration(string name) {

        //get the matching Orchestration
         System.debug('name is: ' + name);
         List<Orchestration__c> curOrchList =
        		 [SELECT  Label__c, Id FROM Orchestration__c WHERE (Label__c = :name)];
         
       	 if (curOrchList.Size() != 1)
       	 	throw new QueryException('either 0 or more than 1 strategy was returned when that name was passed in. Either way, you are screwed');

        //populate an Orchestration object
        Orchestration curOrch = new Orchestration();
        curOrch.label = curOrchList[0].Label__c;
        curOrch.id = curOrchList[0].Id;
        curOrch.members = MaestroController.loadOrchestrationMembers(curOrch.Id);
        System.debug('curOrch.members: ' + curOrch.members);

		return curOrch;
	}

   

	@AuraEnabled
    public static List<OrchestrationMember> loadOrchestrationMembers(string orchestrationId) {

         System.debug('orchestrationId is: ' + orchestrationId);
         List<OrchestrationMember__c> curOrchMemberRecords =
        		 [SELECT  Label__c, Status__c, Type__c, Id FROM OrchestrationMember__c WHERE (Orchestration__c = :orchestrationId)];
         System.debug('curOrchMemberList[0] is: ' + curOrchMemberRecords);

         List<OrchestrationMember> curOrchMemberList = new List<OrchestrationMember>();

         for(OrchestrationMember__c curOrchMemberRecord : curOrchMemberRecords) {
            OrchestrationMember curOrchMember = new OrchestrationMember();
            curOrchMember.label = curOrchMemberRecord.Label__c;
            System.debug('curOrchMemberRecord label is: ' + curOrchMemberRecord.Label__c);
            curOrchMember.status = curOrchMemberRecord.Status__c;
            curOrchMember.type = curOrchMemberRecord.Type__c;
            curOrchMember.itemNum = curOrchMemberRecord.Id;
            curOrchMemberList.add(curOrchMember);
         }
            
       	 
		return curOrchMemberList;
	}


}
