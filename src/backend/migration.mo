import Map "mo:core/Map";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {
  // Types needed only for migration
  type QuotationRequest = {
    id : Text;
    serviceType : {
      #digital;
      #banner;
      #offset;
      #design;
    };
    deadline : Int;
    projectDetails : Text;
    mobileNumber : Text;
    email : Text;
    status : {
      #pendingCustomerResponse;
      #accepted;
      #rejected;
      #negotiating;
    };
    timestamp : Int;
    negotiationHistory : [{
      sender : Text;
      message : Text;
      timestamp : Int;
    }];
    customer : Principal;
  };

  type QuotationDetails = {
    price : Int;
    description : Text;
    terms : Text;
    approved : Bool;
    approvalTimestamp : ?Int;
  };

  type Project = {
    id : Text;
    imageUrl : Text;
    title : Text;
    description : Text;
    category : {
      #digital;
      #banner;
      #offset;
      #design;
    };
    dateCompleted : Int;
  };

  type Review = {
    id : Text;
    customerName : Text;
    reviewText : Text;
    rating : Int;
    imageUrl : ?Text;
    projectType : {
      #digital;
      #banner;
      #offset;
      #design;
    };
    submissionDate : Int;
  };

  type ChatMessage = {
    id : Text;
    senderName : Text;
    senderEmail : Text;
    messageText : Text;
    timestamp : Int;
    isReply : Bool;
    originalMessageId : ?Text;
    senderIsOwner : Bool;
    replyToMessageId : ?Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text; email : Text; mobileNumber : Text }>;
    quotations : Map.Map<Text, QuotationRequest>;
    quotationDetails : Map.Map<Text, QuotationDetails>;
    projects : Map.Map<Text, Project>;
    reviews : Map.Map<Text, Review>;
    chatMessages : Map.Map<Text, ChatMessage>;
    nextId : Int;
    // Assume blob and company location not changed, they will be preserved
    // companyLogo : ?Storage.ExternalBlob;
    // officeLocation : ?OfficeLocation;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text; email : Text; mobileNumber : Text }>;
    quotations : Map.Map<Text, QuotationRequest>;
    quotationDetails : Map.Map<Text, QuotationDetails>;
    projects : Map.Map<Text, Project>;
    reviews : Map.Map<Text, Review>;
    chatMessages : Map.Map<Text, ChatMessage>;
    adminUsers : Map.Map<Text, {
      email : Text;
      hashedPassword : Text;
      biometricRegistered : Bool;
      invitedBy : Principal;
      invitationTimestamp : Int;
    }>;
    emailToPrincipal : Map.Map<Text, Principal>;
    nextId : Nat;
    // companyLogo : ?Storage.ExternalBlob;
    // officeLocation : ?OfficeLocation;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      adminUsers = Map.empty<Text, {
        email : Text;
        hashedPassword : Text;
        biometricRegistered : Bool;
        invitedBy : Principal;
        invitationTimestamp : Int;
      }>();
      emailToPrincipal = Map.empty<Text, Principal>();
      nextId = Int.abs(old.nextId);
    };
  };
};
