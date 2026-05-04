import Map "mo:core/Map";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import RideTypes "../types/rides";
import DriverTypes "../types/drivers";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  public func requestRide(
    rides : Map.Map<Text, RideTypes.Ride>,
    drivers : Map.Map<CommonTypes.UserId, DriverTypes.DriverInfo>,
    caller : CommonTypes.UserId,
    pickup : CommonTypes.Location,
    destination : CommonTypes.Location,
    nextId : Nat,
  ) : CommonTypes.Result<RideTypes.Ride, Text> {
    // Check passenger doesn't already have an active ride
    let activeAsPassenger = rides.values().find(func(r : RideTypes.Ride) : Bool {
      Principal.equal(r.passengerId, caller) and
      r.status != #Completed and r.status != #Cancelled
    });
    switch (activeAsPassenger) {
      case (?_) { return #err("You already have an active ride") };
      case null {};
    };
    // Find nearest driver
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
    let rideId = nextId.toText();
    let ride : RideTypes.Ride = {
      id = rideId;
      passengerId = caller;
      driverId = bestId;
      pickup = pickup;
      destination = destination;
      status = switch (bestId) { case null #Searching; case (?_) #Accepted };
      createdAt = Time.now();
      fare = 100;
    };
    rides.add(rideId, ride);
    #ok(ride);
  };

  public func acceptRide(
    rides : Map.Map<Text, RideTypes.Ride>,
    caller : CommonTypes.UserId,
    rideId : Text,
  ) : CommonTypes.Result<RideTypes.Ride, Text> {
    // Check driver doesn't already have an active ride
    let activeAsDriver = rides.values().find(func(r : RideTypes.Ride) : Bool {
      switch (r.driverId) {
        case (?did) {
          Principal.equal(did, caller) and
          r.status != #Completed and r.status != #Cancelled
        };
        case null false;
      };
    });
    switch (activeAsDriver) {
      case (?_) { return #err("You already have an active ride") };
      case null {};
    };
    switch (rides.get(rideId)) {
      case null { #err("Ride not found") };
      case (?ride) {
        if (ride.status != #Searching) {
          return #err("Ride is not in searching state");
        };
        let updated = { ride with driverId = ?caller; status = #Accepted };
        rides.add(rideId, updated);
        #ok(updated);
      };
    };
  };

  public func rejectRide(
    rides : Map.Map<Text, RideTypes.Ride>,
    caller : CommonTypes.UserId,
    rideId : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (rides.get(rideId)) {
      case null { #err("Ride not found") };
      case (?ride) {
        let isAssignedDriver = switch (ride.driverId) {
          case (?did) Principal.equal(did, caller);
          case null false;
        };
        if (not isAssignedDriver) {
          return #err("You are not the assigned driver");
        };
        if (ride.status != #Accepted) {
          return #err("Ride cannot be rejected in current state");
        };
        let updated = { ride with driverId = null; status = #Searching };
        rides.add(rideId, updated);
        #ok(());
      };
    };
  };

  public func startRide(
    rides : Map.Map<Text, RideTypes.Ride>,
    caller : CommonTypes.UserId,
    rideId : Text,
  ) : CommonTypes.Result<RideTypes.Ride, Text> {
    switch (rides.get(rideId)) {
      case null { #err("Ride not found") };
      case (?ride) {
        let isAssignedDriver = switch (ride.driverId) {
          case (?did) Principal.equal(did, caller);
          case null false;
        };
        if (not isAssignedDriver) {
          return #err("You are not the assigned driver");
        };
        if (ride.status != #Accepted) {
          return #err("Ride must be accepted before starting");
        };
        let updated = { ride with status = #Ongoing };
        rides.add(rideId, updated);
        #ok(updated);
      };
    };
  };

  public func completeRide(
    rides : Map.Map<Text, RideTypes.Ride>,
    caller : CommonTypes.UserId,
    rideId : Text,
  ) : CommonTypes.Result<RideTypes.Ride, Text> {
    switch (rides.get(rideId)) {
      case null { #err("Ride not found") };
      case (?ride) {
        let isAssignedDriver = switch (ride.driverId) {
          case (?did) Principal.equal(did, caller);
          case null false;
        };
        if (not isAssignedDriver) {
          return #err("You are not the assigned driver");
        };
        if (ride.status != #Ongoing) {
          return #err("Ride must be ongoing to complete");
        };
        let updated = { ride with status = #Completed; fare = 100 };
        rides.add(rideId, updated);
        #ok(updated);
      };
    };
  };

  public func cancelRide(
    rides : Map.Map<Text, RideTypes.Ride>,
    caller : CommonTypes.UserId,
    rideId : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (rides.get(rideId)) {
      case null { #err("Ride not found") };
      case (?ride) {
        if (not Principal.equal(ride.passengerId, caller)) {
          return #err("Only the passenger can cancel");
        };
        if (ride.status == #Completed or ride.status == #Cancelled) {
          return #err("Ride is already finished");
        };
        let updated = { ride with status = #Cancelled };
        rides.add(rideId, updated);
        #ok(());
      };
    };
  };

  public func getActiveRide(
    rides : Map.Map<Text, RideTypes.Ride>,
    caller : CommonTypes.UserId,
  ) : ?RideTypes.Ride {
    rides.values().find(func(r : RideTypes.Ride) : Bool {
      let isPassenger = Principal.equal(r.passengerId, caller);
      let isDriver = switch (r.driverId) {
        case (?did) Principal.equal(did, caller);
        case null false;
      };
      (isPassenger or isDriver) and
      r.status != #Completed and r.status != #Cancelled
    });
  };

  public func getPendingRides(
    rides : Map.Map<Text, RideTypes.Ride>,
  ) : [RideTypes.Ride] {
    let pending = rides.values()
      .filter(func(r : RideTypes.Ride) : Bool { r.status == #Searching })
      .toArray();
    // Sort by createdAt descending (newest first)
    pending.sort(func(a : RideTypes.Ride, b : RideTypes.Ride) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    });
  };

  public func getById(
    rides : Map.Map<Text, RideTypes.Ride>,
    id : Text,
  ) : ?RideTypes.Ride {
    rides.get(id);
  };
};
