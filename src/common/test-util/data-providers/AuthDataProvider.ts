import { RegistrationModel } from "../../../components/forms/RegistrationForm";
import AuthTestFixture from "../fixtures/AuthTestFixture";
import { RegistrationFormType } from "../../../common/enums/authEnum";

export interface ErrorTestCase<T> {
  description: string;
  model: T;
  expectedError: string;
}

export default class AuthDataProvider {
  static registrationFormErrorCases: ErrorTestCase<RegistrationModel>[] = [
    {
      description: "Password is less than 8 characters",
      model: AuthTestFixture.createRegistrationModel({
        password: "1234567",
        confirmPassword: "1234567",
      }),
      expectedError: RegistrationFormType.InvalidPasswordLength,
    },
    {
      description: "Password does not match",
      model: AuthTestFixture.createRegistrationModel({
        password: "12345679",
        confirmPassword: "12345678",
      }),
      expectedError: RegistrationFormType.PasswordDoesNotMatch,
    },
    {
      description: "Terms not agreed",
      model: AuthTestFixture.createRegistrationModel({
        agreeToTerms: false,
      }),
      expectedError: RegistrationFormType.TermsNotAgreed,
    },
    {
      description: "Email already exists",
      model: AuthTestFixture.createRegistrationModel({
        email: "existing@example.com",
      }),
      expectedError: RegistrationFormType.EmailAlreadyExists,
    },
    {
      description: "Server error",
      model: AuthTestFixture.createRegistrationModel({
        email: "server-error@example.com",
        password: "validpassword123",
        confirmPassword: "validpassword123",
        agreeToTerms: true,
      }),
      expectedError: RegistrationFormType.UnknownError,
    },
  ];
}
