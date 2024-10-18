export enum StatusCode {
  // 1xx: Informational
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102, // WebDAV
  EarlyHints = 103, // HTTP/1.1

  // 2xx: Success
  Success = 200,
  Created = 201,
  SuccessCreate = 201, // Duplicated with Created for consistency
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207, // WebDAV
  AlreadyReported = 208, // WebDAV
  IMUsed = 226, // HTTP Delta encoding

  // 3xx: Redirection
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,

  // 4xx: Client Errors
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  AccessToTheTargetResourceIsNoLongerAvailable = 410, // Duplicated for clarity
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  URITooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  IAmATeapot = 418, // RFC 2324
  MisdirectedRequest = 421,
  UnprocessableEntity = 422, // WebDAV
  Locked = 423, // WebDAV
  FailedDependency = 424, // WebDAV
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,

  // 5xx: Server Errors
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HTTPVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507, // WebDAV
  LoopDetected = 508, // WebDAV
  BandwidthLimitExceeded = 509, // Commonly used by web hosting services
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,

  // Non-standard codes (often used in specific contexts or by certain systems)
  SiteIsFrozen = 530, // Not standard, but used by some services
  NetworkReadTimeoutError = 598, // Informal convention used by some proxies
  NetworkConnectTimeoutError = 599, // Informal convention used by some proxies
}
