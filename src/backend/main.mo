import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


// Apply migration

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    name : Text;
    email : Text;
    mobileNumber : Text;
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

  public type QuotationStatus = {
    #pendingCustomerResponse;
    #accepted;
    #rejected;
    #negotiating;
  };

  public type NegotiationMessage = {
    sender : Text;
    message : Text;
    timestamp : Int;
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
  };

  public type QuotationDetails = {
    price : Int;
    description : Text;
    terms : Text;
    approved : Bool;
    approvalTimestamp : ?Int;
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
    biometricRegistered : Bool;
    invitedBy : Principal;
    invitationTimestamp : Int;
  };

  // Persistent state
  let userProfiles = Map.empty<Principal, UserProfile>();
  let quotations = Map.empty<Text, QuotationRequest>();
  let quotationDetails = Map.empty<Text, QuotationDetails>();
  let projects = Map.empty<Text, Project>();
  let reviews = Map.empty<Text, Review>();
  let chatMessages = Map.empty<Text, ChatMessage>();
  let adminUsers = Map.empty<Text, AdminInvitationEntry>();
  let emailToPrincipal = Map.empty<Text, Principal>();
  var nextId = 0;
  var companyLogo : ?Storage.ExternalBlob = null;
  var officeLocation : ?OfficeLocation = null;

  // ID Generation
  func generateId() : Text {
    let id = nextId;
    nextId += 1;
    id.toText();
  };

  // Chat System
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
    let allMessages = chatMessages.values().toArray();
    allMessages.sort(
      func(a, b) {
        Int.compare(b.timestamp, a.timestamp);
      }
    );
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

    let sortedCustomerMessages = customerMessages.toArray().sort(
      func(a, b) { Int.compare(a.timestamp, b.timestamp) }
    );
    let sortedOwnerReplies = ownerReplies.toArray().sort(
      func(a, b) { Int.compare(a.timestamp, b.timestamp) }
    );

    {
      messages = sortedCustomerMessages;
      replies = sortedOwnerReplies;
    };
  };

  // User Profile Management
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

  public shared ({ caller }) func setCompanyLogo(_logo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set the company logo");
    };
    companyLogo := ?_logo;
  };

  public shared ({ caller }) func setOfficeLocation(_location : OfficeLocation) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set the office location");
    };
    officeLocation := ?_location;
  };

  public query ({ caller }) func getCompanyLogo() : async ?Storage.ExternalBlob {
    companyLogo;
  };

  public query ({ caller }) func getOfficeLocation() : async ?OfficeLocation {
    officeLocation;
  };

  // New Auth System: Admin User Management
  public shared ({ caller }) func inviteAdminUser(
    email : Text,
    hashedPassword : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can invite users");
    };

    let newUser : AdminInvitationEntry = {
      email;
      hashedPassword;
      biometricRegistered = false;
      invitedBy = caller;
      invitationTimestamp = Time.now();
    };
    adminUsers.add(email, newUser);
  };

  public shared ({ caller }) func registerBiometric(email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can register biometric");
    };

    // Verify the caller owns this email
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.email != email) {
          Runtime.trap("Unauthorized: You can only register biometric for your own email");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found");
      };
    };

    switch (adminUsers.get(email)) {
      case (?user) {
        let updatedUser : AdminInvitationEntry = {
          email = user.email;
          hashedPassword = user.hashedPassword;
          biometricRegistered = true;
          invitedBy = user.invitedBy;
          invitationTimestamp = user.invitationTimestamp;
        };
        adminUsers.add(email, updatedUser);
      };
      case null {
        Runtime.trap("Admin user not found");
      };
    };
  };

  public shared ({ caller }) func verifyAuthentication(email : Text, hashedPassword : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify authentication");
    };

    // Verify the caller owns this email
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.email != email) {
          Runtime.trap("Unauthorized: You can only verify authentication for your own email");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found");
      };
    };

    switch (adminUsers.get(email)) {
      case (?user) {
        user.hashedPassword == hashedPassword;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getAdminInvitations() : async [AdminInvitationEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view admin invitations");
    };
    adminUsers.values().toArray();
  };

  // Quotations
  public shared ({ caller }) func createQuotationRequest(
    serviceType : ServiceType,
    deadline : Int,
    projectDetails : Text,
    mobileNumber : Text,
    email : Text,
  ) : async Text {
    let id = generateId();
    let request : QuotationRequest = {
      id;
      serviceType;
      deadline;
      projectDetails;
      mobileNumber;
      email;
      status = #pendingCustomerResponse;
      timestamp = Time.now();
      negotiationHistory = [];
      customer = caller;
    };
    quotations.add(id, request);
    id;
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
    };
    quotationDetails.add(quotationId, details);
  };

  public shared ({ caller }) func approveQuotation(quotationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve quotations");
    };

    let existingDetails = quotationDetails.get(quotationId);
    let updatedDetails : QuotationDetails = switch (existingDetails) {
      case (?details) {
        {
          price = details.price;
          description = details.description;
          terms = details.terms;
          approved = true;
          approvalTimestamp = ?Time.now();
        };
      };
      case null {
        {
          price = 0;
          description = "";
          terms = "";
          approved = true;
          approvalTimestamp = ?Time.now();
        };
      };
    };
    quotationDetails.add(quotationId, updatedDetails);

    let quotation = quotations.get(quotationId);
    switch (quotation) {
      case (?q) {
        let updatedQuotation : QuotationRequest = {
          id = q.id;
          serviceType = q.serviceType;
          deadline = q.deadline;
          projectDetails = q.projectDetails;
          mobileNumber = q.mobileNumber;
          email = q.email;
          status = q.status;
          timestamp = q.timestamp;
          negotiationHistory = q.negotiationHistory;
          customer = q.customer;
        };
        quotations.add(quotationId, updatedQuotation);
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

    let quotation = quotations.get(quotationId);
    switch (quotation) {
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
          case (#pendingCustomerResponse) {
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
          status = status;
          timestamp = q.timestamp;
          negotiationHistory = negotiationHistory.toArray();
          customer = q.customer;
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

    let quotation = quotations.get(quotationId);
    switch (quotation) {
      case (?q) {
        let negotiationHistory = List.fromArray<NegotiationMessage>(q.negotiationHistory);

        let negotiationMsg : NegotiationMessage = {
          sender = "admin";
          message = message;
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
        };
        quotations.add(quotationId, updatedQuotation);
      };
      case (null) {
        Runtime.trap("Quotation not found");
      };
    };
  };

  public query ({ caller }) func getQuotationDetails(quotationId : Text) : async ?QuotationDetails {
    let quotation = quotations.get(quotationId);
    switch (quotation) {
      case (?q) {
        if (q.customer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only view details of your own quotations");
        };
        quotationDetails.get(quotationId);
      };
      case (null) {
        null;
      };
    };
  };

  public query ({ caller }) func getQuotationStatistics() : async {
    pending : Nat;
    accepted : Nat;
    rejected : Nat;
    negotiating : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view quotation statistics");
    };

    var pending = 0;
    var accepted = 0;
    var rejected = 0;
    var negotiating = 0;

    for (q in quotations.values()) {
      switch (q.status) {
        case (#pendingCustomerResponse) { pending += 1 };
        case (#accepted) { accepted += 1 };
        case (#rejected) { rejected += 1 };
        case (#negotiating) { negotiating += 1 };
      };
    };

    { pending; accepted; rejected; negotiating };
  };

  // Projects and Reviews
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
    let existingProject = projects.get(projectId);
    switch (existingProject) {
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

  public shared ({ caller }) func addReview(
    customerName : Text,
    reviewText : Text,
    rating : Int,
    imageUrl : ?Text,
    projectType : ServiceType,
  ) : async Text {
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

  public query ({ caller }) func getReviewsByRating(rating : Int) : async [Review] {
    reviews.values().toArray().filter(func(r) { r.rating == rating });
  };

  public query ({ caller }) func getAllReviews() : async [Review] {
    reviews.values().toArray();
  };

  public query ({ caller }) func getProjectsByCategory(category : ServiceType) : async [Project] {
    projects.values().toArray().filter(func(p) { p.category == category });
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    projects.values().toArray();
  };

  public query ({ caller }) func calculateDeliveryFee(distance : Int) : async Int {
    distance * 10_000;
  };
};
