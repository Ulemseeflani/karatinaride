import Map "mo:core/Map";
import CommonTypes "../types/common";
import DriverTypes "../types/drivers";
import DriverLib "../lib/drivers";

mixin (
  drivers : Map.Map<CommonTypes.UserId, DriverTypes.DriverInfo>,
) {
  public shared ({ caller }) func setDriverOnline(
    online : Bool
  ) : async CommonTypes.Result<(), Text> {
    DriverLib.setOnline(drivers, caller, online);
  };

  public shared ({ caller }) func updateDriverLocation(
    lat : Float,
    lng : Float,
  ) : async CommonTypes.Result<(), Text> {
    DriverLib.updateLocation(drivers, caller, lat, lng);
  };

  public query func getOnlineDrivers() : async [DriverTypes.DriverInfo] {
    DriverLib.getOnline(drivers);
  };
};
