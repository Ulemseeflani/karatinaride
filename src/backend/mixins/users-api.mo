import List "mo:core/List";
import CommonTypes "../types/common";
import UserTypes "../types/users";
import UserLib "../lib/users";

mixin (users : List.List<UserTypes.User>) {
  public shared ({ caller }) func registerUser(
    name : Text,
    phone : Text,
    role : CommonTypes.Role,
  ) : async CommonTypes.Result<UserTypes.User, Text> {
    UserLib.register(users, caller, name, phone, role);
  };

  public query func getUser(id : CommonTypes.UserId) : async ?UserTypes.User {
    UserLib.getById(users, id);
  };

  public shared query ({ caller }) func getCurrentUser() : async ?UserTypes.User {
    UserLib.getById(users, caller);
  };
};
