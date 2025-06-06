export enum RegistrationFormType {
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
