import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
    mobileNumber : Text;
  };

  public type QuotationStatus = {
    #draft;
    #customerPending;
    #paymentPending;
    #workInProgress;
    #completed;
    #accepted;
    #rejected;
    #negotiating;
  };

  public type ServiceType = {
    #digital;
    #banner;
    #offset;
    #design;
  };

  public type OfficeLocation = {
    address : Text;
    lat : Float;
    lon : Float;
  };

  public type QuotationRequest = {
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

  public type DesignStatus = {
    #ready;
    #needed;
  };

  public type QuotationDetails = {
    price : Int;
    description : Text;
    terms : Text;
    approved : Bool;
    approvalTimestamp : ?Int;
    replyFile : ?Storage.ExternalBlob;
  };

  public type Project = {
    id : Text;
    imageUrl : Text;
    title : Text;
    description : Text;
    category : ServiceType;
    dateCompleted : Int;
  };

  public type Review = {
    id : Text;
    customerName : Text;
    reviewText : Text;
    rating : Int;
    imageUrl : ?Text;
    projectType : ServiceType;
    submissionDate : Int;
  };

  public type ChatMessage = {
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

  public type AdminInvitationEntry = {
    email : Text;
    hashedPassword : Text;
    registrationMethod : Text;
    invitedBy : ?Principal;
    invitationTimestamp : Int;
  };

  public type AdminUser = {
    principal : ?Principal;
    registrationMethod : Text;
    registrationTimestamp : Int;
    active : Bool;
  };

  public type ContactInfo = {
    email : Text;
    phone : Text;
    physicalAddress : Text;
    mapsLink : Text;
  };

  public type DeliveryConfig = {
    perKmRate : Int;
    minimumFee : Int;
  };

  public type DeliveryInfo = {
    distance : Int;
    price : Int;
    fromAddress : Text;
    toAddress : ?Text;
    isCustomAddress : Bool;
    isUrgent : Bool;
    customerLocation : ?Text;
    serviceType : Text;
  };

  public type DeliveryFeeCalculation = {
    price : Int;
    distance : Int;
    fromAddress : Text;
    toAddress : ?Text;
    isCustomAddress : Bool;
    isUrgent : Bool;
    customerLocation : ?Text;
    serviceType : Text;
  };

  public type NegotiationMessage = {
    sender : Text;
    message : Text;
    timestamp : Int;
  };

  public type Customer = {
    id : Text;
    email : Text;
    mobileNumber : Text;
    passwordHash : Text;
  };

  public type ServiceImage = {
    id : Text;
    serviceType : Text;
    imageUrl : Text;
    description : Text;
  };

  public type VideoClip = {
    id : Text;
    serviceType : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    description : Text;
  };

  public type AdminContent = {
    contactInfo : ContactInfo;
    services : [Text];
    businessHours : [Text];
    gallery : [Text];
    homepageContent : Text;
    aboutPageContent : Text;
  };

  var appName : Text = "Nellore Print Hub";

  var nextId = 0;
  var logo : ?Storage.ExternalBlob = null;
  var officeLocation : ?OfficeLocation = null;
  var deliveryConfig : DeliveryConfig = { perKmRate = 1000; minimumFee = 10000 };
  var contactInfo : ContactInfo = {
    email = "magic.nellorehub@gmail.com";
    phone = "+919390535070";
    physicalAddress = "Dargamitta, Podalakur Road, Nellore";
    mapsLink = "https://maps.app.goo.gl/TTjDJUpgKHcE6RHX9?G_st=ic2";
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let quotations = Map.empty<Text, QuotationRequest>();
  let quotationDetails = Map.empty<Text, QuotationDetails>();
  let projects = Map.empty<Text, Project>();
  let reviews = Map.empty<Text, Review>();
  let chatMessages = Map.empty<Text, ChatMessage>();
  let adminUsers = Map.empty<Text, AdminInvitationEntry>();
  let adminPrincipals = Map.empty<Principal, AdminUser>();
  let emailToPrincipal = Map.empty<Text, Principal>();
  let customers = Map.empty<Text, Customer>();
  let serviceImages = Map.empty<Text, ServiceImage>();
  let videoClips = Map.empty<Text, VideoClip>();
  var adminContent : ?AdminContent = null;

  func generateId() : Text {
    let id = nextId;
    nextId += 1;
    id.toText();
  };

  // ── App Name Management ───────────────────────────────────────────────

  public query ({ caller }) func getAppName() : async Text {
    appName;
  };

  public shared ({ caller }) func setAppName(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set the app name");
    };
    appName := name;
  };

  // ── Chat ──────────────────────────────────────────────────────────────────

  public shared ({ caller }) func sendMessage(
    senderName : Text,
    senderEmail : Text,
    messageText : Text,
  ) : async Text {
    let id = generateId();
    let chatMessage : ChatMessage = {
      id;
      senderName;
      senderEmail;
      messageText;
      timestamp = Time.now();
      isReply = false;
      originalMessageId = null;
      senderIsOwner = false;
      replyToMessageId = null;
    };
    chatMessages.add(id, chatMessage);
    id;
  };

  public shared ({ caller }) func ownerReply(
    replyToMessageId : Text,
    replyText : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can send replies");
    };
    let replyId = generateId();
    let replyMessage : ChatMessage = {
      id = replyId;
      senderName = "Owner";
      senderEmail = "owner@example.com";
      messageText = replyText;
      timestamp = Time.now();
      isReply = true;
      originalMessageId = ?replyToMessageId;
      senderIsOwner = true;
      replyToMessageId = ?replyToMessageId;
    };
    chatMessages.add(replyId, replyMessage);

    switch (chatMessages.get(replyToMessageId)) {
      case (?originalMessage) {
        let updatedMessage : ChatMessage = {
          id = originalMessage.id;
          senderName = originalMessage.senderName;
          senderEmail = originalMessage.senderEmail;
          messageText = originalMessage.messageText;
          timestamp = originalMessage.timestamp;
          isReply = originalMessage.isReply;
          originalMessageId = originalMessage.originalMessageId;
          senderIsOwner = originalMessage.senderIsOwner;
          replyToMessageId = ?replyId;
        };
        chatMessages.add(replyToMessageId, updatedMessage);
      };
      case (null) {
        Runtime.trap("Original message not found");
      };
    };
    replyId;
  };

  public query ({ caller }) func getAllChatMessages() : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can view all chat messages");
    };
    chatMessages.values().toArray();
  };

  public query ({ caller }) func getChatsForCustomer(senderEmail : Text) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      switch (userProfiles.get(caller)) {
        case (?profile) {
          if (profile.email != senderEmail) {
            Runtime.trap("Unauthorized: You can only view your own chat messages");
          };
        };
        case (null) {
          Runtime.trap("Unauthorized: Only admins or authenticated users can view chat messages");
        };
      };
    };

    let filteredMessages = chatMessages.values().toArray().filter(
      func(msg) { msg.senderEmail == senderEmail }
    );
    filteredMessages.sort(
      func(a, b) { Int.compare(b.timestamp, a.timestamp) }
    );
  };

  public query ({ caller }) func getCustomerChatHistory(senderEmail : Text) : async {
    messages : [ChatMessage];
    replies : [ChatMessage];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can view customer chat history");
    };

    let customerMessages = List.empty<ChatMessage>();
    let ownerReplies = List.empty<ChatMessage>();

    let allMessages = chatMessages.values().toArray();

    for (msg in allMessages.values()) {
      if (msg.senderEmail == senderEmail and not msg.senderIsOwner) {
        customerMessages.add(msg);
      };
      if (msg.senderIsOwner and msg.replyToMessageId != null) {
        switch (msg.originalMessageId) {
          case (?originalId) {
            switch (chatMessages.get(originalId)) {
              case (?originalMsg) {
                if (originalMsg.senderEmail == senderEmail) {
                  ownerReplies.add(msg);
                };
              };
              case (null) {};
            };
          };
          case (null) {};
        };
      };
    };

    {
      messages = customerMessages.toArray();
      replies = ownerReplies.toArray();
    };
  };

  // ── User Profiles ─────────────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    emailToPrincipal.add(profile.email, caller);
  };

  // ── Branding / Office ─────────────────────────────────────────────────────

  public shared ({ caller }) func setLogo(_logo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set the company logo");
    };
    logo := ?_logo;
  };

  public shared ({ caller }) func setOfficeLocation(_location : OfficeLocation) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set the office location");
    };
    officeLocation := ?_location;
  };

  // ── Contact Info ──────────────────────────────────────────────────────────

  public shared ({ caller }) func updateContactInfo(email : Text, phone : Text, physicalAddress : Text, mapsLink : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update contact info");
    };
    contactInfo := { email; phone; physicalAddress; mapsLink };
  };

  public query func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  public query func getLogo() : async ?Storage.ExternalBlob {
    logo;
  };

  public query func getOfficeLocation() : async ?OfficeLocation {
    officeLocation;
  };

  // ── Delivery Config ───────────────────────────────────────────────────────

  public shared ({ caller }) func setDeliveryConfig(perKmRate : Int, minimumFee : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set delivery configuration");
    };
    deliveryConfig := { perKmRate; minimumFee };
  };

  public query func getDeliveryConfig() : async DeliveryConfig {
    deliveryConfig;
  };

  public query func calculateDeliveryFee(distance : Int) : async Int {
    let calculatedFee = distance * deliveryConfig.perKmRate;
    if (calculatedFee < deliveryConfig.minimumFee) {
      deliveryConfig.minimumFee;
    } else {
      calculatedFee;
    };
  };

  // ── Admin Registration ────────────────────────────────────────────────────

  /// Register the first admin user if no admins exist yet.
  /// Only used for the very first admin setup; cannot be called once an admin exists.
  /// The caller must be a non-anonymous principal (authenticated via Internet Identity).
  public shared ({ caller }) func registerFirstAdmin(email : Text, hashedPassword : Text) : async () {
    // Block if any admin already exists
    if (adminPrincipals.size() > 0) {
      Runtime.trap("Register first admin can be called only when no admins exist yet");
    };

    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous principals cannot register as admins");
    };

    let newAdminInvitation : AdminInvitationEntry = {
      email;
      hashedPassword;
      registrationMethod = "biometric";
      invitedBy = ?caller;
      invitationTimestamp = Time.now();
    };

    adminUsers.add(email, newAdminInvitation);

    let newAdminUser : AdminUser = {
      principal = ?caller;
      registrationMethod = "biometric";
      registrationTimestamp = Time.now();
      active = true;
    };
    adminPrincipals.add(caller, newAdminUser);

    AccessControl.assignRole(accessControlState, caller, caller, #admin);
    emailToPrincipal.add(email, caller);
  };

  // Admin-only (once an admin exists): invite a new admin user.
  public shared ({ caller }) func inviteAdminUser(
    email : Text,
    hashedPassword : Text,
  ) : async () {
    // Once any admin exists, only admins may invite further admins.
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can invite admin users");
    };
    let newUser : AdminInvitationEntry = {
      email;
      hashedPassword;
      registrationMethod = "biometric";
      invitedBy = ?caller;
      invitationTimestamp = Time.now();
    };
    adminUsers.add(email, newUser);
  };

  // Admin-only: add another Internet Identity admin.
  public shared ({ caller }) func addInternetIdentityAdmin(principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add admin users");
    };

    if (principal.isAnonymous()) {
      Runtime.trap("Invalid: Anonymous principals cannot become admins");
    };

    let newAdmin : AdminUser = {
      principal = ?principal;
      registrationMethod = "internetIdentity";
      registrationTimestamp = Time.now();
      active = true;
    };
    adminPrincipals.add(principal, newAdmin);

    AccessControl.assignRole(accessControlState, caller, principal, #admin);
  };

  // Invitation-gated: register via biometric using a pre-existing invitation.
  public shared ({ caller }) func registerBiometric(email : Text) : async () {
    switch (adminUsers.get(email)) {
      case (?user) {
        if (user.registrationMethod != "biometric") {
          Runtime.trap("Invalid: This invitation is not for biometric registration");
        };

        if (caller.isAnonymous()) {
          Runtime.trap("Unauthorized: Anonymous principals cannot register as admins");
        };

        let newAdmin : AdminUser = {
          principal = ?caller;
          registrationMethod = "biometric";
          registrationTimestamp = Time.now();
          active = true;
        };
        adminPrincipals.add(caller, newAdmin);

        AccessControl.assignRole(accessControlState, caller, caller, #admin);

        emailToPrincipal.add(email, caller);
      };
      case null {
        Runtime.trap("No admin invitation found for this email");
      };
    };
  };

  // Public: used during the biometric login flow to verify credentials.
  public shared ({ caller }) func verifyAuthentication(email : Text, hashedPassword : Text) : async Bool {
    switch (adminUsers.get(email)) {
      case (?user) {
        user.hashedPassword == hashedPassword;
      };
      case (null) { false };
    };
  };

  // Admin-only: list pending invitations.
  public query ({ caller }) func getAdminInvitations() : async [AdminInvitationEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view admin invitations");
    };
    adminUsers.values().toArray();
  };

  // Admin-only: list registered admin principals.
  public query ({ caller }) func getAdminPrincipals() : async [AdminUser] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view admin principals");
    };
    adminPrincipals.values().toArray();
  };

  // Public: used by the frontend to decide whether to show "register first admin".
  public query func getAdminUserCount() : async Nat {
    var count = 0;
    for (admin in adminPrincipals.values()) {
      if (admin.active) { count += 1 };
    };
    count;
  };

  // ── Quotations ────────────────────────────────────────────────────────────

  // Authenticated users only: submit a quotation request.
  public shared ({ caller }) func createQuotationRequest(
    serviceType : ServiceType,
    deadline : Int,
    projectDetails : Text,
    mobileNumber : Text,
    email : Text,
    designStatus : DesignStatus,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit quotation requests");
    };
    let id = generateId();
    let request : QuotationRequest = {
      id;
      serviceType;
      deadline;
      projectDetails;
      mobileNumber;
      email;
      status = #draft;
      timestamp = Time.now();
      negotiationHistory = [];
      customer = caller;
      designStatus;
    };
    quotations.add(id, request);
    id;
  };

  public shared ({ caller }) func markQuotationCustomerPending(quotationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark quotation as customer pending");
    };
    let updatedRequests = List.empty<(Text, QuotationRequest)>();
    for ((id, request) in quotations.entries()) {
      let status = if (request.id == quotationId and request.status == #draft) {
        #customerPending;
      } else { request.status };
      let updatedRequest = {
        id = request.id;
        serviceType = request.serviceType;
        deadline = request.deadline;
        projectDetails = request.projectDetails;
        mobileNumber = request.mobileNumber;
        email = request.email;
        status;
        timestamp = request.timestamp;
        negotiationHistory = request.negotiationHistory;
        customer = request.customer;
        designStatus = request.designStatus;
      };
      updatedRequests.add((id, updatedRequest));
    };
    quotations.clear();
    for ((id, newRequest) in updatedRequests.values()) {
      quotations.add(id, newRequest);
    };
  };

  public shared ({ caller }) func customerApproveQuotation(quotationId : Text) : async () {
    switch (quotations.get(quotationId)) {
      case (?request) {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
          Runtime.trap("Unauthorized: Only authenticated customers can approve quotations");
        };
        if (request.customer != caller) {
          Runtime.trap("Unauthorized: Only the quotation owner can approve");
        };
        let updatedRequests = List.empty<(Text, QuotationRequest)>();
        for ((id, quote) in quotations.entries()) {
          let status = if (quote.id == quotationId and quote.status == #customerPending) {
            #paymentPending;
          } else { quote.status };
          let updatedRequest = {
            id = quote.id;
            serviceType = quote.serviceType;
            deadline = quote.deadline;
            projectDetails = quote.projectDetails;
            mobileNumber = quote.mobileNumber;
            email = quote.email;
            status;
            timestamp = quote.timestamp;
            negotiationHistory = quote.negotiationHistory;
            customer = quote.customer;
            designStatus = quote.designStatus;
          };
          updatedRequests.add((id, updatedRequest));
        };
        quotations.clear();
        for ((id, newQuote) in updatedRequests.values()) {
          quotations.add(id, newQuote);
        };
      };
      case (null) {
        Runtime.trap("Quotation not found");
      };
    };
  };

  public shared ({ caller }) func adminAcceptPayment(quotationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark payment received and start work");
    };
    let updatedRequests = List.empty<(Text, QuotationRequest)>();
    for ((id, request) in quotations.entries()) {
      let status = if (request.id == quotationId and request.status == #paymentPending) {
        #workInProgress;
      } else { request.status };
      let updatedRequest = {
        id = request.id;
        serviceType = request.serviceType;
        deadline = request.deadline;
        projectDetails = request.projectDetails;
        mobileNumber = request.mobileNumber;
        email = request.email;
        status;
        timestamp = request.timestamp;
        negotiationHistory = request.negotiationHistory;
        customer = request.customer;
        designStatus = request.designStatus;
      };
      updatedRequests.add((id, updatedRequest));
    };
    quotations.clear();
    for ((id, newRequest) in updatedRequests.values()) {
      quotations.add(id, newRequest);
    };
  };

  public query ({ caller }) func getAllQuotations() : async [QuotationRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all quotations");
    };
    quotations.values().toArray();
  };

  public query ({ caller }) func getMyQuotations() : async [QuotationRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their quotations");
    };
    quotations.values().toArray().filter(func(q) { q.customer == caller });
  };

  public shared ({ caller }) func addQuotationDetails(
    quotationId : Text,
    price : Int,
    description : Text,
    terms : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add quotation details");
    };
    let details : QuotationDetails = {
      price;
      description;
      terms;
      approved = false;
      approvalTimestamp = null;
      replyFile = null;
    };
    quotationDetails.add(quotationId, details);
  };

  public shared ({ caller }) func approveQuotation(quotationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve quotations");
    };

    switch (quotationDetails.get(quotationId)) {
      case (?details) {
        let updatedDetails : QuotationDetails = {
          price = details.price;
          description = details.description;
          terms = details.terms;
          approved = true;
          approvalTimestamp = ?Time.now();
          replyFile = details.replyFile;
        };
        quotationDetails.add(quotationId, updatedDetails);
      };
      case null {};
    };
  };

  public shared ({ caller }) func handleQuotationResponse(
    quotationId : Text,
    status : QuotationStatus,
    message : ?Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can respond to quotations");
    };

    switch (quotations.get(quotationId)) {
      case (?q) {
        if (q.customer != caller) {
          Runtime.trap("Unauthorized: You can only respond to your own quotations");
        };

        let negotiationHistory = List.fromArray<NegotiationMessage>(q.negotiationHistory);

        switch (status) {
          case (#negotiating) {
            switch (message) {
              case (?msg) {
                let negotiationMsg : NegotiationMessage = {
                  sender = "customer";
                  message = msg;
                  timestamp = Time.now();
                };
                negotiationHistory.add(negotiationMsg);
              };
              case (null) {
                Runtime.trap("Message is required for negotiation");
              };
            };
          };
          case (#accepted or #rejected) {};
          case (#customerPending) {
            Runtime.trap("Invalid status transition");
          };
          case (#draft) {
            Runtime.trap("Invalid status transition");
          };
          case (#paymentPending) {
            Runtime.trap("Invalid status transition");
          };
          case (#workInProgress) {
            Runtime.trap("Invalid status transition");
          };
          case (#completed) {
            Runtime.trap("Invalid status transition");
          };
        };

        let updatedQuotation : QuotationRequest = {
          id = q.id;
          serviceType = q.serviceType;
          deadline = q.deadline;
          projectDetails = q.projectDetails;
          mobileNumber = q.mobileNumber;
          email = q.email;
          status;
          timestamp = q.timestamp;
          negotiationHistory = negotiationHistory.toArray();
          customer = q.customer;
          designStatus = q.designStatus;
        };
        quotations.add(quotationId, updatedQuotation);
      };
      case (null) {
        Runtime.trap("Quotation not found");
      };
    };
  };

  public shared ({ caller }) func respondToNegotiation(quotationId : Text, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can respond to negotiations");
    };

    switch (quotations.get(quotationId)) {
      case (?q) {
        let negotiationHistory = List.fromArray<NegotiationMessage>(q.negotiationHistory);

        let negotiationMsg : NegotiationMessage = {
          sender = "admin";
          message;
          timestamp = Time.now();
        };
        negotiationHistory.add(negotiationMsg);

        let updatedQuotation : QuotationRequest = {
          id = q.id;
          serviceType = q.serviceType;
          deadline = q.deadline;
          projectDetails = q.projectDetails;
          mobileNumber = q.mobileNumber;
          email = q.email;
          status = #negotiating;
          timestamp = q.timestamp;
          negotiationHistory = negotiationHistory.toArray();
          customer = q.customer;
          designStatus = q.designStatus;
        };
        quotations.add(quotationId, updatedQuotation);
      };
      case (null) {
        Runtime.trap("Quotation not found");
      };
    };
  };

  public query ({ caller }) func getQuotationDetails(quotationId : Text) : async ?QuotationDetails {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      // Must be an authenticated user who owns this quotation.
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only authenticated users can view quotation details");
      };
      switch (quotations.get(quotationId)) {
        case (?q) {
          if (q.customer != caller) {
            Runtime.trap("Unauthorized: You can only view details of your own quotations");
          };
        };
        case (null) {
          Runtime.trap("Quotation not found");
        };
      };
    };
    quotationDetails.get(quotationId);
  };

  public query ({ caller }) func getQuotationStatistics() : async {
    draft : Nat;
    customerPending : Nat;
    paymentPending : Nat;
    workInProgress : Nat;
    completed : Nat;
    accepted : Nat;
    rejected : Nat;
    negotiating : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view quotation statistics");
    };

    var draft = 0;
    var customerPending = 0;
    var paymentPending = 0;
    var workInProgress = 0;
    var completed = 0;
    var accepted = 0;
    var rejected = 0;
    var negotiating = 0;

    for (q in quotations.values()) {
      switch (q.status) {
        case (#draft) { draft += 1 };
        case (#customerPending) { customerPending += 1 };
        case (#paymentPending) { paymentPending += 1 };
        case (#workInProgress) { workInProgress += 1 };
        case (#completed) { completed += 1 };
        case (#accepted) { accepted += 1 };
        case (#rejected) { rejected += 1 };
        case (#negotiating) { negotiating += 1 };
      };
    };
    {
      draft;
      customerPending;
      paymentPending;
      workInProgress;
      completed;
      accepted;
      rejected;
      negotiating;
    };
  };

  public query ({ caller }) func getPendingQuotationsOlderThan1Hour() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending quotations");
    };
    let currentTime = Int.abs(Time.now());
    let allQuotations = quotations.toArray();
    let pendingQuotations = allQuotations.filter(
      func((_, quotation)) {
        quotation.status == #customerPending;
      }
    );
    let oldQuotations = pendingQuotations.filter(
      func((_, quotation)) {
        currentTime - Int.abs(quotation.timestamp) > 3_600_000_000_000;
      }
    );
    let oldQuotationIds = List.empty<Text>();
    for ((id, _) in oldQuotations.values()) {
      oldQuotationIds.add(id);
    };
    oldQuotationIds.toArray();
  };

  public shared ({ caller }) func addReplyFile(quotationId : Text, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add reply files");
    };
    switch (quotationDetails.get(quotationId)) {
      case (?details) {
        let updatedDetails : QuotationDetails = {
          price = details.price;
          description = details.description;
          terms = details.terms;
          approved = details.approved;
          approvalTimestamp = details.approvalTimestamp;
          replyFile = details.replyFile;
        };
        quotationDetails.add(quotationId, updatedDetails);
      };
      case (null) {
        Runtime.trap("Quotation details not found");
      };
    };
  };

  public query ({ caller }) func getReplyFile(quotationId : Text) : async ?Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      // Must be an authenticated user who owns this quotation.
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only authenticated users can download reply files");
      };
      switch (quotations.get(quotationId)) {
        case (?q) {
          if (q.customer != caller) {
            Runtime.trap("Unauthorized: You can only download reply files for your own quotations");
          };
        };
        case (null) {
          Runtime.trap("Quotation not found");
        };
      };
    };
    switch (quotationDetails.get(quotationId)) {
      case (?details) { details.replyFile };
      case (null) { null };
    };
  };

  // ── Projects ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func addProject(
    imageUrl : Text,
    title : Text,
    description : Text,
    category : ServiceType,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add projects");
    };
    let id = generateId();
    let project : Project = {
      id;
      imageUrl;
      title;
      description;
      category;
      dateCompleted = Time.now();
    };
    projects.add(id, project);
    id;
  };

  public shared ({ caller }) func editProject(
    projectId : Text,
    imageUrl : Text,
    title : Text,
    description : Text,
    category : ServiceType,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit projects");
    };
    switch (projects.get(projectId)) {
      case (?p) {
        let updatedProject : Project = {
          id = p.id;
          imageUrl;
          title;
          description;
          category;
          dateCompleted = p.dateCompleted;
        };
        projects.add(projectId, updatedProject);
      };
      case null {
        Runtime.trap("Project not found");
      };
    };
  };

  public shared ({ caller }) func deleteProject(projectId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete projects");
    };
    projects.remove(projectId);
  };

  // ── Reviews ───────────────────────────────────────────────────────────────

  public shared ({ caller }) func addReview(
    customerName : Text,
    reviewText : Text,
    rating : Int,
    imageUrl : ?Text,
    projectType : ServiceType,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit reviews");
    };
    let id = generateId();
    let review : Review = {
      id;
      customerName;
      reviewText;
      rating;
      imageUrl;
      projectType;
      submissionDate = Time.now();
    };
    reviews.add(id, review);
    id;
  };

  public query func getReviewsByRating(rating : Int) : async [Review] {
    reviews.values().toArray().filter(func(r) { r.rating == rating });
  };

  public query func getAllReviews() : async [Review] {
    reviews.values().toArray();
  };

  public query func getProjectsByCategory(category : ServiceType) : async [Project] {
    projects.values().toArray().filter(func(p) { p.category == category });
  };

  public query func getAllProjects() : async [Project] {
    projects.values().toArray();
  };

  // ── Customer Self-Service Portal ──────────────────────────────────────────

  public shared ({ caller }) func registerCustomer(
    email : Text,
    mobileNumber : Text,
    passwordHash : Text,
  ) : async Text {
    // Prevent duplicate registrations by email
    for ((_, existing) in customers.entries()) {
      if (existing.email == email) {
        Runtime.trap("A customer with this email already exists");
      };
      if (existing.mobileNumber == mobileNumber and mobileNumber != "") {
        Runtime.trap("A customer with this mobile number already exists");
      };
    };
    let id = generateId();
    let customer : Customer = {
      id;
      email;
      mobileNumber;
      passwordHash;
    };
    customers.add(id, customer);
    id;
  };

  public shared ({ caller }) func authenticateCustomer(
    identifier : Text,
    passwordHash : Text,
  ) : async Text {
    for ((_, customer) in customers.entries()) {
      if (
        (customer.email == identifier or customer.mobileNumber == identifier) and
        customer.passwordHash == passwordHash
      ) {
        return customer.id;
      };
    };
    Runtime.trap("Invalid credentials");
  };

  public query ({ caller }) func getCustomerQuotations(customerId : Text) : async [QuotationRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can look up quotations by customer id");
    };
    switch (customers.get(customerId)) {
      case (?customer) {
        quotations.values().toArray().filter(
          func(q) { q.email == customer.email or q.mobileNumber == customer.mobileNumber }
        );
      };
      case (null) {
        Runtime.trap("Customer not found");
      };
    };
  };

  // ── Service Images & Video Clips ──────────────────────────────────────────

  public shared ({ caller }) func addServiceImage(
    serviceType : Text,
    imageUrl : Text,
    description : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add service images");
    };
    let id = generateId();
    let serviceImage : ServiceImage = {
      id;
      serviceType;
      imageUrl;
      description;
    };
    serviceImages.add(id, serviceImage);
    id;
  };

  public shared ({ caller }) func deleteServiceImage(imageId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete service images");
    };
    serviceImages.remove(imageId);
  };

  public shared ({ caller }) func addVideoClip(
    serviceType : Text,
    videoUrl : Text,
    thumbnailUrl : Text,
    description : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add video clips");
    };
    let id = generateId();
    let videoClip : VideoClip = {
      id;
      serviceType;
      videoUrl;
      thumbnailUrl;
      description;
    };
    videoClips.add(id, videoClip);
    id;
  };

  public shared ({ caller }) func deleteVideoClip(clipId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete video clips");
    };
    videoClips.remove(clipId);
  };

  public query func getServiceImages() : async [ServiceImage] {
    serviceImages.values().toArray();
  };

  public query func getVideoClips() : async [VideoClip] {
    videoClips.values().toArray();
  };

  // ── Admin Content Editor ──────────────────────────────────────────────────

  public shared ({ caller }) func updateAdminContent(
    newContactInfo : ContactInfo,
    services : [Text],
    businessHours : [Text],
    gallery : [Text],
    homepageContent : Text,
    aboutPageContent : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update site content");
    };
    let newAdminContent : AdminContent = {
      contactInfo = newContactInfo;
      services;
      businessHours;
      gallery;
      homepageContent;
      aboutPageContent;
    };
    adminContent := ?newAdminContent;
    // Also keep the top-level contactInfo variable in sync.
    contactInfo := newContactInfo;
  };

  public query func getAdminContent() : async ?AdminContent {
    adminContent;
  };
};
