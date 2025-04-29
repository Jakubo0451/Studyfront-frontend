import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CheckboxQuestionBuilder from "../components/questionTypes/checkboxQ.jsx";
import '@testing-library/jest-dom';

describe("CheckboxQuestionBuilder", () => {
  test("renders input for question and one option (positive)", () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);

    expect(screen.getByPlaceholderText("Enter your question")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Option 1")).toBeInTheDocument();
  });

  test("adds new options when 'Add Option' is clicked (positive)", () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);
    fireEvent.click(screen.getByText("Add Option"));

    expect(screen.getByPlaceholderText("Option 2")).toBeInTheDocument();
  });

  test("removes option when 'Remove' is clicked (boundary case)", () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);
    fireEvent.click(screen.getByText("Add Option")); // Now 2 options
    fireEvent.click(screen.getAllByText("Remove")[0]); // Remove the first
  
    const inputs = screen.getAllByPlaceholderText(/Option/i);
    expect(inputs.length).toBe(1); // Only one option should remain
  });
  

  test("allows question text to be changed (positive)", () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);
    const input = screen.getByPlaceholderText("Enter your question");
    fireEvent.change(input, { target: { value: "What is your favorite color?" } });

    expect(input.value).toBe("What is your favorite color?");
  });

  test("handles edge case of all options removed", () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);
    // Remove all existing options
    const removeButtons = screen.getAllByText("Remove");
    removeButtons.forEach((btn) => fireEvent.click(btn));

    expect(screen.queryByPlaceholderText("Option 1")).not.toBeInTheDocument();
  });

  test("handles negative input: extremely long option text", () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);
    const optionInput = screen.getByPlaceholderText("Option 1");
    const longText = "A".repeat(1000);
    fireEvent.change(optionInput, { target: { value: longText } });

    expect(optionInput.value.length).toBe(1000);
  });
});
