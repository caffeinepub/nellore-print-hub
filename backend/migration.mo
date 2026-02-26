import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Storage "blob-storage/Storage";

module {
  type UserProfile = {
    name : Text;
    email : Text;
    mobileNumber : Text;
  };

  type QuotationStatus = {
    #draft;
    #customerPending;
    #paymentPending;
    #workInProgress;
    #completed;
    #accepted;
    #rejected;
    #negotiating;
  };

  type ServiceType = {
    #digital;
    #banner;
    #offset;
    #design;
  };

  type OfficeLocation = {
    address : Text;
    lat : Float;
    lon : Float;
  };

  type QuotationRequest = {
    id : Text;
    serviceType : ServiceType;
    deadline : Int;
    projectDetails : Text;
    mobileNumber : Text;
    email : Text;
    status : QuotationStatus;
    timestamp : Int;
    negotiationHistory : [NegotiationMessage];
    customer : Principal;
    designStatus : DesignStatus;
  };

  type DesignStatus = {
    #ready;
    #needed;
  };

  type QuotationDetails = {
    price : Int;
    description : Text;
    terms : Text;
    approved : Bool;
    approvalTimestamp : ?Int;
    replyFile : ?Storage.ExternalBlob;
  };

  type Project = {
    id : Text;
    imageUrl : Text;
    title : Text;
    description : Text;
    category : ServiceType;
    dateCompleted : Int;
  };

  type Review = {
    id : Text;
    customerName : Text;
    reviewText : Text;
    rating : Int;
    imageUrl : ?Text;
    projectType : ServiceType;
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

  type AdminInvitationEntry = {
    email : Text;
    hashedPassword : Text;
    registrationMethod : Text;
    invitedBy : ?Principal;
    invitationTimestamp : Int;
  };

  type AdminUser = {
    principal : ?Principal;
    registrationMethod : Text;
    registrationTimestamp : Int;
    active : Bool;
  };

  type ContactInfo = {
    email : Text;
    phone : Text;
    physicalAddress : Text;
    mapsLink : Text;
  };

  type DeliveryConfig = {
    perKmRate : Int;
    minimumFee : Int;
  };

  type DeliveryInfo = {
    distance : Int;
    price : Int;
    fromAddress : Text;
    toAddress : ?Text;
    isCustomAddress : Bool;
    isUrgent : Bool;
    customerLocation : ?Text;
    serviceType : Text;
  };

  type DeliveryFeeCalculation = {
    price : Int;
    distance : Int;
    fromAddress : Text;
    toAddress : ?Text;
    isCustomAddress : Bool;
    isUrgent : Bool;
    customerLocation : ?Text;
    serviceType : Text;
  };

  type NegotiationMessage = {
    sender : Text;
    message : Text;
    timestamp : Int;
  };

  type Customer = {
    id : Text;
    email : Text;
    mobileNumber : Text;
    passwordHash : Text;
  };

  type ServiceImage = {
    id : Text;
    serviceType : Text;
    imageUrl : Text;
    description : Text;
  };

  type VideoClip = {
    id : Text;
    serviceType : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    description : Text;
  };

  type AdminContent = {
    contactInfo : ContactInfo;
    services : [Text];
    businessHours : [Text];
    gallery : [Text];
    homepageContent : Text;
    aboutPageContent : Text;
  };

  type Actor = {
    appName : Text;
    nextId : Nat;
    logo : ?Storage.ExternalBlob;
    officeLocation : ?OfficeLocation;
    deliveryConfig : DeliveryConfig;
    contactInfo : ContactInfo;
    userProfiles : Map.Map<Principal, UserProfile>;
    quotations : Map.Map<Text, QuotationRequest>;
    quotationDetails : Map.Map<Text, QuotationDetails>;
    projects : Map.Map<Text, Project>;
    reviews : Map.Map<Text, Review>;
    chatMessages : Map.Map<Text, ChatMessage>;
    adminUsers : Map.Map<Text, AdminInvitationEntry>;
    adminPrincipals : Map.Map<Principal, AdminUser>;
    emailToPrincipal : Map.Map<Text, Principal>;
    customers : Map.Map<Text, Customer>;
    serviceImages : Map.Map<Text, ServiceImage>;
    videoClips : Map.Map<Text, VideoClip>;
    adminContent : ?AdminContent;
  };

  public func run(state : Actor) : Actor {
    state;
  };
};
