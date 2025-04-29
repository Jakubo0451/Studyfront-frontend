import validator from "validator";

// Validation helpers
function isValidName(name) {
  return validator.isLength(name, { min: 1, max: 50 });
}

function isValidEmail(email) {
  return validator.isEmail(email);
}

function isValidPassword(password) {
  return validator.isLength(password, { min: 8 }) && /\d/.test(password);
}

describe("Signup validation", () => {
  // Name tests
  test("valid name passes", () => {
    expect(isValidName("John Doe")).toBe(true);
  });

  test("empty name fails", () => {
    expect(isValidName("")).toBe(false);
  });

  test("name longer than 50 chars fails", () => {
    expect(isValidName("a".repeat(51))).toBe(false);
  });

  // Email tests
  test("valid email passes", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  test("invalid email fails", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  // Password tests
  test("valid password passes", () => {
    expect(isValidPassword("password1")).toBe(true);
  });

  test("password less than 8 chars fails", () => {
    expect(isValidPassword("pass1")).toBe(false);
  });

  test("password without number fails", () => {
    expect(isValidPassword("password")).toBe(false);
  });
});