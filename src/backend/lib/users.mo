import Debug "mo:core/Debug";
import List "mo:core/List";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import UserTypes "../types/users";
import Time "mo:core/Time";

module {
  public func register(
    users : List.List<UserTypes.User>,
    caller : CommonTypes.UserId,
    name : Text,
    phone : Text,
    role : CommonTypes.Role,
  ) : CommonTypes.Result<UserTypes.User, Text> {
    if (name == "") { return #err("Name cannot be empty") };
    if (phone == "") { return #err("Phone cannot be empty") };
    let existing = users.find(func(u : UserTypes.User) : Bool {
      Principal.equal(u.id, caller)
    });
    switch (existing) {
      case (?_) { #err("User already registered") };
      case null {
        let user : UserTypes.User = {
          id = caller;
          name = name;
          phone = phone;
          role = role;
          createdAt = Time.now();
        };
        users.add(user);
        #ok(user);
      };
    };
  };

  public func getById(
    users : List.List<UserTypes.User>,
    id : CommonTypes.UserId,
  ) : ?UserTypes.User {
    users.find(func(u : UserTypes.User) : Bool {
      Principal.equal(u.id, id)
    });
  };
};
