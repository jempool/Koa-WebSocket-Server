import { SignUp } from "../../src/controllers/auth.controller";
import * as authService from "../../src/services/auth.service";

jest.mock("../../src/services/auth.service");

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn(() => "mock_token"),
}));

jest.mock("bcrypt", () => ({
  ...jest.requireActual("bcrypt"),
  genSaltSync: jest.fn(() => "mock_salt"),
  hashSync: jest.fn(() => "mock_hashed_password"),
  compareSync: jest.fn(() => true),
}));

describe("Auth Controller - SignUp", () => {
  it("should create a new user and return tokens", async () => {
    (authService.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (authService.createUser as jest.Mock).mockImplementation((user) =>
      Promise.resolve(user)
    );

    const ctx = createMockContext({
      request: {
        body: {
          name: "newUser",
          email: "newuser@example.com",
          password: "password123",
        },
      },
    });

    await SignUp(ctx, () => Promise.resolve());

    expect(ctx.body).toHaveProperty("user");
    expect(ctx.body).toHaveProperty("accessToken");
    expect(ctx.body).toHaveProperty("refreshToken");
    expect(ctx.status).toBeNull();
  });

  it("should return an error when trying to sign up with an email that already exists", async () => {
    (authService.getUserByEmail as jest.Mock).mockResolvedValue({
      name: "existingUser",
      email: "existinguser@example.com",
      password: "existing_hashed_password",
    });

    const ctx = createMockContext({
      request: {
        body: {
          name: "existingUser",
          email: "existinguser@example.com",
          password: "password123",
        },
      },
    });

    await SignUp(ctx, () => Promise.resolve());

    expect(ctx.status).toEqual(400);
    expect(ctx.body.message).toContain("already associated with an account");
  });
});

// Mock context creation
function createMockContext(requestData: any): any {
  return {
    request: {
      body: requestData,
    },
    state: {},
    body: null,
    status: null,
  };
}
