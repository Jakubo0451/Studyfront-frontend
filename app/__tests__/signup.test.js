import validator from "validator";

function isValidName(name) {
  return validator.isLength(name, { min: 1, max: 50 });
}

function isValidEmail(email) {
  return validator.isEmail(email);
}

function isValidPassword(password) {
  return (
    validator.isLength(password, { min: 8 }) &&
    /\d/.test(password)
  );
}

describe("Unit Tests - Validation for Signup Form", () => {
  // Positive test cases
  test("Valid name - 'John Doe'", () => {
    expect(isValidName("John Doe")).toBe(true);
  });

  test("Valid email - 'john@example.com'", () => {
    expect(isValidEmail("john@example.com")).toBe(true);
  });

  test("Valid password - 'password123'", () => {
    expect(isValidPassword("password123")).toBe(true);
  });

  // Boundary test cases
  test("Name with exactly 50 characters", () => {
    const name = "A".repeat(50);
    expect(isValidName(name)).toBe(true);
  });

  test("Password with exactly 8 characters and a number", () => {
    expect(isValidPassword("abc12345")).toBe(true);
  });

  // Edge test cases
  test("Name with 1 character (minimum allowed)", () => {
    expect(isValidName("A")).toBe(true);
  });

  test("Name with 0 characters (just below valid)", () => {
    expect(isValidName("")).toBe(false);
  });

  // Negative test cases
  test("Invalid email - missing @", () => {
    expect(isValidEmail("johndoeexample.com")).toBe(false);
  });

  test("Invalid email - empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  test("Invalid password - less than 8 characters", () => {
    expect(isValidPassword("abc123")).toBe(false);
  });

  test("Invalid password - no number included", () => {
    expect(isValidPassword("abcdefgh")).toBe(false);
  });

  test("Invalid name - more than 50 characters", () => {
    const name = "A".repeat(51);
    expect(isValidName(name)).toBe(false);
  });

  test("Invalid password - empty string", () => {
    expect(isValidPassword("")).toBe(false);
  });
});
