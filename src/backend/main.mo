import List "mo:core/List";
import Map "mo:core/Map";
import UserTypes "types/users";
import DriverTypes "types/drivers";
import UsersMixin "mixins/users-api";
import DriversMixin "mixins/drivers-api";
import RidesMixin "mixins/rides-api";
import CommonTypes "types/common";
import RideTypes "types/rides";

actor {
  let users = List.empty<UserTypes.User>();
  let drivers = Map.empty<CommonTypes.UserId, DriverTypes.DriverInfo>();
  let rides = Map.empty<Text, RideTypes.Ride>();

  include UsersMixin(users);
  include DriversMixin(drivers);
  include RidesMixin(drivers, rides);
};

