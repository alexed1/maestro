
    public with sharing class Orchestration {

        @AuraEnabled public String name;
        @AuraEnabled public List<OrchestrationMember> members;
        @AuraEnabled public String description;
        @AuraEnabled public String label;
        @AuraEnabled public String id;


        public Orchestration() {
            
        	members = new List<OrchestrationMember> ();
        }



        
    }