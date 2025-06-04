import { RegistrationModel } from "../../../components/forms/RegistrationForm";

export default class AuthTestFixture {
  public static NAME: string = "John Doe";
  public static EMAIL: string = "john.doe@example.com";
  public static PASSWORD: string = "Password123!";
  public static CONFIRM_PASSWORD: string = "Password123!";
  public static AGREE_TO_TERMS: boolean = true;

  public static createRegistrationModel(
    updatedData?: Partial<RegistrationModel>
  ): RegistrationModel {
    return {
      name: AuthTestFixture.NAME,
      email: AuthTestFixture.EMAIL,
      password: AuthTestFixture.PASSWORD,
      confirmPassword: AuthTestFixture.CONFIRM_PASSWORD,
      agreeToTerms: AuthTestFixture.AGREE_TO_TERMS,
      ...updatedData,
    };
  }
}
