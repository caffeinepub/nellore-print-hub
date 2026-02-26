import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Text "mo:core/Text";

module {
  type OldAdminUser = {
    principal : ?Principal;
    registrationMethod : {
      #biometric;
      #internetIdentity;
    };
    registrationTimestamp : Int.Int;
    active : Bool;
  };

  type OldAdminInvitationEntry = {
    email : Text;
    hashedPassword : Text;
    registrationMethod : {
      #biometric;
      #internetIdentity;
    };
    invitedBy : Principal;
    invitationTimestamp : Int.Int;
  };

  type OldActor = {
    adminUsers : Map.Map<Text, OldAdminInvitationEntry>;
    adminPrincipals : Map.Map<Principal, OldAdminUser>;
  };

  type NewAdminUser = {
    principal : ?Principal;
    registrationMethod : Text.Text;
    registrationTimestamp : Int.Int;
    active : Bool;
  };

  type NewAdminInvitationEntry = {
    email : Text;
    hashedPassword : Text;
    registrationMethod : Text.Text;
    invitedBy : Principal;
    invitationTimestamp : Int.Int;
  };

  type NewActor = {
    adminUsers : Map.Map<Text, NewAdminInvitationEntry>;
    adminPrincipals : Map.Map<Principal, NewAdminUser>;
  };

  public func run(old : OldActor) : NewActor {
    let newAdminUsers = old.adminUsers.map<Text, OldAdminInvitationEntry, NewAdminInvitationEntry>(
      func(_email, oldEntry) {
        {
          oldEntry with
          registrationMethod = switch (oldEntry.registrationMethod) {
            case (#biometric) { "biometric" };
            case (#internetIdentity) { "internetIdentity" };
          };
        };
      }
    );

    let newAdminPrincipals = old.adminPrincipals.map<Principal, OldAdminUser, NewAdminUser>(
      func(_p, oldUser) {
        {
          oldUser with
          registrationMethod = switch (oldUser.registrationMethod) {
            case (#biometric) { "biometric" };
            case (#internetIdentity) { "internetIdentity" };
          };
        };
      }
    );
    {
      adminUsers = newAdminUsers;
      adminPrincipals = newAdminPrincipals;
    };
  };
};
