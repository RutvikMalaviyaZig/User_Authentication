const MESSAGES = {
    OK: "Request was successful.",
    CREATED: "Resource was created successfully.",
    ACCEPTED: "Request has been accepted, but not yet processed.",
    NO_CONTENT: "No content to return.",
    MOVED_PERMANENTLY: "Resource has been permanently moved.",
    FOUND: "Resource has been found, but temporarily located elsewhere.",
    NOT_MODIFIED: "Resource has not been modified since the last request.",
    BAD_REQUEST: "The request was invalid or cannot be processed.",
    UNAUTHORIZED: "Authentication is required.",
    FORBIDDEN: "You do not have permission to access this resource.",
    NOT_FOUND: "Resource not found.",
    METHOD_NOT_ALLOWED: "The request method is not allowed for this resource.",
    INTERNAL_SERVER_ERROR: "An error occurred on the server.",
    NOT_IMPLEMENTED: "The server does not support the requested functionality.",
    BAD_GATEWAY: "The server received an invalid response from the upstream server.",
    SERVICE_UNAVAILABLE: "The service is temporarily unavailable.",
    GATEWAY_TIMEOUT: "The request timed out while waiting for a response."
  };
  
  module.exports = MESSAGES;
  