import CommonTypes "common";

module {
  public type DriverInfo = {
    userId : CommonTypes.UserId;
    online : Bool;
    lastLocation : ?CommonTypes.Location;
    lastSeen : CommonTypes.Timestamp;
  };
};
