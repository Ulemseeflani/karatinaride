import Principal "mo:core/Principal";

module {
  public type UserId = Principal;
  public type Timestamp = Int;

  public type Location = {
    lat : Float;
    lng : Float;
  };

  public type Role = {
    #Passenger;
    #Driver;
  };

  public type RideStatus = {
    #Searching;
    #Accepted;
    #Ongoing;
    #Completed;
    #Cancelled;
  };

  public type Result<T, E> = {
    #ok : T;
    #err : E;
  };
};
