import CommonTypes "common";

module {
  public type User = {
    id : CommonTypes.UserId;
    name : Text;
    phone : Text;
    role : CommonTypes.Role;
    createdAt : CommonTypes.Timestamp;
  };
};
