import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldUserProfile = {
    name : Text;
    email : Text;
    mobileNumber : Text;
  };

  type OldServiceType = {
    #digital;
    #banner;
    #offset;
    #design;
  };

  type OldOfficeLocation = {
    address : Text;
    lat : Float;
    lon : Float;
  };

  type OldQuotationStatus = {
    #pendingCustomerResponse;
    #accepted;
    #rejected;
    #negotiating;
  };

  type OldNegotiationMessage = {
    sender : Text;
    message : Text;
    timestamp : Int;
  };

  type OldQuotationRequest = {
    id : Text;
    serviceType : OldServiceType;
    deadline : Int;
    projectDetails : Text;
    mobileNumber : Text;
    email : Text;
    status : OldQuotationStatus;
    timestamp : Int;
    negotiationHistory : [OldNegotiationMessage];
    customer : Principal;
    quotationFileBlob : ?Storage.ExternalBlob;
  };

  type OldQuotationDetails = {
    price : Int;
    description : Text;
    terms : Text;
    approved : Bool;
    approvalTimestamp : ?Int;
  };

  type OldProject = {
    id : Text;
    imageUrl : Text;
    title : Text;
    description : Text;
    category : OldServiceType;
    dateCompleted : Int;
  };

  type OldReview = {
    id : Text;
    customerName : Text;
    reviewText : Text;
    rating : Int;
    imageUrl : ?Text;
    projectType : OldServiceType;
    submissionDate : Int;
  };

  type OldChatMessage = {
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

  type OldAdminInvitationEntry = {
    email : Text;
    hashedPassword : Text;
    registrationMethod : {
      #biometric;
      #internetIdentity;
    };
    invitedBy : Principal;
    invitationTimestamp : Int;
  };

  type OldAdminUser = {
    principal : ?Principal;
    registrationMethod : {
      #biometric;
      #internetIdentity;
    };
    registrationTimestamp : Int;
    active : Bool;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    quotations : Map.Map<Text, OldQuotationRequest>;
    quotationDetails : Map.Map<Text, OldQuotationDetails>;
    projects : Map.Map<Text, OldProject>;
    reviews : Map.Map<Text, OldReview>;
    chatMessages : Map.Map<Text, OldChatMessage>;
    adminUsers : Map.Map<Text, OldAdminInvitationEntry>;
    adminPrincipals : Map.Map<Principal, OldAdminUser>;
    emailToPrincipal : Map.Map<Text, Principal>;
    nextId : Nat;
    logo : ?Storage.ExternalBlob;
    officeLocation : ?OldOfficeLocation;
  };

  // New types (same as main.mo)
  type ContactInfo = {
    email : Text;
    phone : Text;
    location : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    quotations : Map.Map<Text, OldQuotationRequest>;
    quotationDetails : Map.Map<Text, OldQuotationDetails>;
    projects : Map.Map<Text, OldProject>;
    reviews : Map.Map<Text, OldReview>;
    chatMessages : Map.Map<Text, OldChatMessage>;
    adminUsers : Map.Map<Text, OldAdminInvitationEntry>;
    adminPrincipals : Map.Map<Principal, OldAdminUser>;
    emailToPrincipal : Map.Map<Text, Principal>;
    nextId : Nat;
    logo : ?Storage.ExternalBlob;
    officeLocation : ?OldOfficeLocation;
    contactInfo : ?ContactInfo;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      contactInfo = null;
    };
  };
};
