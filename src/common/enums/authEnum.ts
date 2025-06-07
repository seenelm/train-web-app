export enum RegistrationErrorTypes {
  PasswordDoesNotMatch = "Passwords do not match",
  InvalidPasswordLength = "Password must be at least 8 characters long",
  TermsNotAgreed = "You must agree to the Terms of Service and Privacy Policy",
  EmailAlreadyExists = "An account with this email already exists",
  PasswordRequired = "Password is required",
  EmailRequired = "Email is required",
  NameRequired = "Name is required",
  DeviceIdRequired = "Device ID is required",
  UnknownError = "Failed to register. Please try again.",
}

export enum LoginErrorTypes {
  PasswordRequired = "Password is required",
  EmailRequired = "Email is required",
  DeviceIdRequired = "Device ID is required",
  InvalidPassword = "Invalid password",
  UnknownError = "Failed to login. Please try again.",
}

export enum AuthErrorTypes {
  ServerError = "Service is currently unavailable. Please try again later.",
}
