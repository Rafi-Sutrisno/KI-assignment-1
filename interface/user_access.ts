export interface UserAccess {
  id: string; // Unique identifier for the access request
  user_request_id: string; // Identifier for the user requesting access
  user_owner_id: string; // Identifier for the user who owns the file
  file_id: string; // Identifier for the file being requested
  status: number; // Status of the access request (0 = pending, 1 = accepted, 2 = rejected)

  encrypted_symmetric_key?: Buffer; // Optional encrypted symmetric key for access
}
