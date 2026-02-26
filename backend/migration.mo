import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

module {
  type OldAdminInvitationEntry = {
    email : Text;
    hashedPassword : Text;
    registrationMethod : Text;
    invitedBy : Principal;
    invitationTimestamp : Int;
  };

  type OldActor = { adminUsers : Map.Map<Text, OldAdminInvitationEntry> };

  type NewAdminInvitationEntry = {
    email : Text;
    hashedPassword : Text;
    registrationMethod : Text;
    invitedBy : ?Principal;
    invitationTimestamp : Int;
  };

  type NewActor = { adminUsers : Map.Map<Text, NewAdminInvitationEntry> };

  let permanentAdminEmail = "magic.nellorehub@gmail.com";
  let permanentAdminHashedPassword = "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342";

  func migrateAdminUsers(oldEntries : Map.Map<Text, OldAdminInvitationEntry>) : Map.Map<Text, NewAdminInvitationEntry> {
    oldEntries.map<Text, OldAdminInvitationEntry, NewAdminInvitationEntry>(
      func(_key, oldAdmin) {
        {
          email = oldAdmin.email;
          hashedPassword = oldAdmin.hashedPassword;
          registrationMethod = oldAdmin.registrationMethod;
          invitedBy = ?oldAdmin.invitedBy;
          invitationTimestamp = oldAdmin.invitationTimestamp;
        };
      }
    );
  };

  func createPermanentAdmin() : Map.Map<Text, NewAdminInvitationEntry> {
    let map = Map.empty<Text, NewAdminInvitationEntry>();
    let permanentAdmin : NewAdminInvitationEntry = {
      email = permanentAdminEmail;
      hashedPassword = permanentAdminHashedPassword;
      registrationMethod = "biometric";
      invitedBy = null;
      invitationTimestamp = Time.now();
    };
    map.add(permanentAdmin.email, permanentAdmin);
    map;
  };

  public func run(old : OldActor) : NewActor {
    let newAdminUsers = if (old.adminUsers.isEmpty()) {
      createPermanentAdmin();
    } else {
      migrateAdminUsers(old.adminUsers);
    };
    { adminUsers = newAdminUsers };
  };
};
