import CommonTypes "common";

module {
  public type Ride = {
    id : Text;
    passengerId : CommonTypes.UserId;
    driverId : ?CommonTypes.UserId;
    pickup : CommonTypes.Location;
    destination : CommonTypes.Location;
    status : CommonTypes.RideStatus;
    createdAt : CommonTypes.Timestamp;
    fare : Nat;
  };
};
