import Debug "mo:core/Debug";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import DriverTypes "../types/drivers";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Iter "mo:core/Iter";

module {
  public func setOnline(
    drivers : Map.Map<CommonTypes.UserId, DriverTypes.DriverInfo>,
    caller : CommonTypes.UserId,
    online : Bool,
  ) : CommonTypes.Result<(), Text> {
    let existing = drivers.get(caller);
    let info : DriverTypes.DriverInfo = switch (existing) {
      case (?d) { { d with online = online; lastSeen = Time.now() } };
      case null {
        {
          userId = caller;
          online = online;
          lastLocation = null;
          lastSeen = Time.now();
        };
      };
    };
    drivers.add(caller, info);
    #ok(());
  };

  public func updateLocation(
    drivers : Map.Map<CommonTypes.UserId, DriverTypes.DriverInfo>,
    caller : CommonTypes.UserId,
    lat : Float,
    lng : Float,
  ) : CommonTypes.Result<(), Text> {
    let existing = drivers.get(caller);
    let info : DriverTypes.DriverInfo = switch (existing) {
      case (?d) {
        { d with lastLocation = ?{ lat = lat; lng = lng }; lastSeen = Time.now() };
      };
      case null {
        {
          userId = caller;
          online = true;
          lastLocation = ?{ lat = lat; lng = lng };
          lastSeen = Time.now();
        };
      };
    };
    drivers.add(caller, info);
    #ok(());
  };

  public func getOnline(
    drivers : Map.Map<CommonTypes.UserId, DriverTypes.DriverInfo>,
  ) : [DriverTypes.DriverInfo] {
    drivers.values()
      .filter(func(d : DriverTypes.DriverInfo) : Bool { d.online })
      .toArray();
  };

  public func findNearest(
    drivers : Map.Map<CommonTypes.UserId, DriverTypes.DriverInfo>,
    pickup : CommonTypes.Location,
  ) : ?CommonTypes.UserId {
    var bestId : ?CommonTypes.UserId = null;
    var bestDist : Float = 1_000_000.0;
    for ((_, d) in drivers.entries()) {
      if (d.online) {
        switch (d.lastLocation) {
          case (?loc) {
            let dlat = loc.lat - pickup.lat;
            let dlng = loc.lng - pickup.lng;
            let dist = dlat * dlat + dlng * dlng;
            if (dist < bestDist) {
              bestDist := dist;
              bestId := ?d.userId;
            };
          };
          case null {};
        };
      };
    };
    bestId;
  };
};
