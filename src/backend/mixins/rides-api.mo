import Map "mo:core/Map";
import CommonTypes "../types/common";
import DriverTypes "../types/drivers";
import RideTypes "../types/rides";
import RideLib "../lib/rides";

mixin (
  drivers : Map.Map<CommonTypes.UserId, DriverTypes.DriverInfo>,
  rides : Map.Map<Text, RideTypes.Ride>,
) {
  public shared ({ caller }) func requestRide(
    pickup : CommonTypes.Location,
    destination : CommonTypes.Location,
  ) : async CommonTypes.Result<RideTypes.Ride, Text> {
    RideLib.requestRide(rides, drivers, caller, pickup, destination, rides.size());
  };

  public shared ({ caller }) func acceptRide(
    rideId : Text
  ) : async CommonTypes.Result<RideTypes.Ride, Text> {
    RideLib.acceptRide(rides, caller, rideId);
  };

  public shared ({ caller }) func rejectRide(
    rideId : Text
  ) : async CommonTypes.Result<(), Text> {
    RideLib.rejectRide(rides, caller, rideId);
  };

  public shared ({ caller }) func startRide(
    rideId : Text
  ) : async CommonTypes.Result<RideTypes.Ride, Text> {
    RideLib.startRide(rides, caller, rideId);
  };

  public shared ({ caller }) func completeRide(
    rideId : Text
  ) : async CommonTypes.Result<RideTypes.Ride, Text> {
    RideLib.completeRide(rides, caller, rideId);
  };

  public shared ({ caller }) func cancelRide(
    rideId : Text
  ) : async CommonTypes.Result<(), Text> {
    RideLib.cancelRide(rides, caller, rideId);
  };

  public shared query ({ caller }) func getMyActiveRide() : async ?RideTypes.Ride {
    RideLib.getActiveRide(rides, caller);
  };

  public query func getPendingRides() : async [RideTypes.Ride] {
    RideLib.getPendingRides(rides);
  };

  public query func getRide(id : Text) : async ?RideTypes.Ride {
    RideLib.getById(rides, id);
  };
};
