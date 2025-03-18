export interface ApiRequest {
  method: string;
  userId: string;
  body: any;
}

export interface ApiResponse {
  data: any;
  error?: string;
}

export interface ApiMethod {
  name: string;
  value: string;
}

export const API_METHODS: ApiMethod[] = [
  { name: 'AddFriends', value: 'AddFriends' },
  { name: 'AddGroupUsers', value: 'AddGroupUsers' },
  { name: 'AuthenticateApple', value: 'AuthenticateApple' },
  { name: 'AuthenticateCustom', value: 'AuthenticateCustom' },
  { name: 'AuthenticateDevice', value: 'AuthenticateDevice' },
  { name: 'AuthenticateEmail', value: 'AuthenticateEmail' },
  { name: 'AuthenticateFacebook', value: 'AuthenticateFacebook' },
  { name: 'AuthenticateFacebookInstantGame', value: 'AuthenticateFacebookInstantGame' },
  { name: 'AuthenticateGameCenter', value: 'AuthenticateGameCenter' },
  { name: 'AuthenticateGoogle', value: 'AuthenticateGoogle' },
  { name: 'AuthenticateSteam', value: 'AuthenticateSteam' },
  { name: 'BanGroupUsers', value: 'BanGroupUsers' },
  { name: 'BlockFriends', value: 'BlockFriends' },
  { name: 'CreateGroup', value: 'CreateGroup' },
  { name: 'DeleteAccount', value: 'DeleteAccount' },
  { name: 'DeleteFriends', value: 'DeleteFriends' },
  { name: 'DeleteGroup', value: 'DeleteGroup' },
  { name: 'DeleteLeaderboardRecord', value: 'DeleteLeaderboardRecord' },
  { name: 'DeleteNotifications', value: 'DeleteNotifications' },
  { name: 'DeleteStorageObjects', value: 'DeleteStorageObjects' },
  { name: 'DeleteTournamentRecord', value: 'DeleteTournamentRecord' },
  { name: 'DemoteGroupUsers', value: 'DemoteGroupUsers' },
  { name: 'Event', value: 'Event' },
  { name: 'GetAccount', value: 'GetAccount' },
  { name: 'GetSubscription', value: 'GetSubscription' },
  { name: 'GetUsers', value: 'GetUsers' },
  { name: 'ImportFacebookFriends', value: 'ImportFacebookFriends' },
  { name: 'ImportSteamFriends', value: 'ImportSteamFriends' },
  { name: 'JoinGroup', value: 'JoinGroup' },
  { name: 'JoinTournament', value: 'JoinTournament' },
  { name: 'KickGroupUsers', value: 'KickGroupUsers' },
  { name: 'LeaveGroup', value: 'LeaveGroup' },
  { name: 'LinkApple', value: 'LinkApple' },
  { name: 'LinkCustom', value: 'LinkCustom' },
  { name: 'LinkDevice', value: 'LinkDevice' },
  { name: 'LinkEmail', value: 'LinkEmail' },
  { name: 'LinkFacebook', value: 'LinkFacebook' },
  { name: 'LinkFacebookInstantGame', value: 'LinkFacebookInstantGame' },
  { name: 'LinkGameCenter', value: 'LinkGameCenter' },
  { name: 'LinkGoogle', value: 'LinkGoogle' },
  { name: 'LinkSteam', value: 'LinkSteam' },
  { name: 'ListChannelMessages', value: 'ListChannelMessages' },
  { name: 'ListFriends', value: 'ListFriends' },
  { name: 'ListFriendsOfFriends', value: 'ListFriendsOfFriends' },
  { name: 'ListGroupUsers', value: 'ListGroupUsers' },
  { name: 'ListGroups', value: 'ListGroups' },
  { name: 'ListLeaderboardRecords', value: 'ListLeaderboardRecords' },
  { name: 'ListLeaderboardRecordsAroundOwner', value: 'ListLeaderboardRecordsAroundOwner' },
  { name: 'ListMatches', value: 'ListMatches' },
  { name: 'ListNotifications', value: 'ListNotifications' },
  { name: 'ListStorageObjects', value: 'ListStorageObjects' },
  { name: 'ListSubscriptions', value: 'ListSubscriptions' },
  { name: 'ListTournamentRecords', value: 'ListTournamentRecords' },
  { name: 'ListTournamentRecordsAroundOwner', value: 'ListTournamentRecordsAroundOwner' },
  { name: 'ListTournaments', value: 'ListTournaments' },
  { name: 'ListUserGroups', value: 'ListUserGroups' },
  { name: 'PromoteGroupUsers', value: 'PromoteGroupUsers' },
  { name: 'ReadStorageObjects', value: 'ReadStorageObjects' },
  { name: 'SessionLogout', value: 'SessionLogout' },
  { name: 'SessionRefresh', value: 'SessionRefresh' },
  { name: 'UnlinkApple', value: 'UnlinkApple' },
  { name: 'UnlinkCustom', value: 'UnlinkCustom' },
  { name: 'UnlinkDevice', value: 'UnlinkDevice' },
  { name: 'UnlinkEmail', value: 'UnlinkEmail' },
  { name: 'UnlinkFacebook', value: 'UnlinkFacebook' },
  { name: 'UnlinkFacebookInstantGame', value: 'UnlinkFacebookInstantGame' },
  { name: 'UnlinkGameCenter', value: 'UnlinkGameCenter' },
  { name: 'UnlinkGoogle', value: 'UnlinkGoogle' },
  { name: 'UnlinkSteam', value: 'UnlinkSteam' },
  { name: 'UpdateAccount', value: 'UpdateAccount' },
  { name: 'UpdateGroup', value: 'UpdateGroup' },
  { name: 'ValidatePurchaseApple', value: 'ValidatePurchaseApple' },
  { name: 'ValidatePurchaseFacebookInstant', value: 'ValidatePurchaseFacebookInstant' },
  { name: 'ValidatePurchaseGoogle', value: 'ValidatePurchaseGoogle' },
  { name: 'ValidatePurchaseHuawei', value: 'ValidatePurchaseHuawei' },
  { name: 'ValidateSubscriptionApple', value: 'ValidateSubscriptionApple' },
  { name: 'ValidateSubscriptionGoogle', value: 'ValidateSubscriptionGoogle' },
  { name: 'WriteLeaderboardRecord', value: 'WriteLeaderboardRecord' },
  { name: 'WriteStorageObjects', value: 'WriteStorageObjects' },
  { name: 'WriteTournamentRecord', value: 'WriteTournamentRecord' }
]; 