import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CheckboxQuestionBuilder from "../components/questionTypes/checkboxQ.jsx";
import "@testing-library/jest-dom";

describe("CheckboxQuestionBuilder", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  test("renders input for question and one option (positive)", () => {
    render(
      <CheckboxQuestionBuilder
        onChange={() => {}}
        questionData={{ questionText: "Sample Question", options: ["Option 1"] }}
      />
    );
  
    expect(screen.getByPlaceholderText("Enter your question")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Option 1")).toBeInTheDocument();
  });

  test("adds new options when 'Add Option' is clicked (positive)", async () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);
    await act(async () => {
      fireEvent.click(screen.getByText("Add Option"));
    });

    expect(screen.getByPlaceholderText("Option 2")).toBeInTheDocument();
  });

  test("removes option when 'Remove' is clicked (boundary case)", async () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);
  
    // Add a second option
    await act(async () => {
      fireEvent.click(screen.getByText("Add Option"));
    });
  
    // Verify that the second option is added
    expect(screen.getByPlaceholderText("Option 2")).toBeInTheDocument();
  
    // Remove the first option
    await act(async () => {
      fireEvent.click(screen.getAllByText("Remove")[0]);
    });
  
    // Verify that only one option remains
    const inputs = screen.getAllByPlaceholderText(/Option/i);
    expect(inputs.length).toBe(1); // Only one option should remain
    expect(screen.queryByPlaceholderText("Option 1")).toBeInTheDocument(); // Remaining option becomes "Option 1"
  });

  test("saves automatically when question text is updated(positive)", async () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);

    const questionInput = screen.getByPlaceholderText("Enter your question");
    await act(async () => {
      fireEvent.change(questionInput, { target: { value: "New Question" } });
    });

    expect(fetch).toHaveBeenCalledWith(`${backendUrl}/api/studies/${editStudyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "checkbox",
        questionText: "New Question",
        options: [""],
      }),
    });
  });

  test("handles edge case of all options removed(edge)", async () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);
    const removeButtons = screen.getAllByText("Remove");
    await act(async () => {
      removeButtons.forEach((btn) => fireEvent.click(btn)); // Remove all options
    });

    expect(screen.queryByPlaceholderText("Option 1")).not.toBeInTheDocument();
  });

  test("handles negative input: extremely long option text(negative)", async () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);
    const optionInput = screen.getByPlaceholderText("Option 1");
    const longText = "A".repeat(1000);
    await act(async () => {
      fireEvent.change(optionInput, { target: { value: longText } });
    });

    expect(optionInput.value.length).toBe(1000);
  });

  test("calls onChange with updated question text(positive)", async () => {
    const mockOnChange = jest.fn();
    render(<CheckboxQuestionBuilder onChange={mockOnChange} />);

    const questionInput = screen.getByPlaceholderText("Enter your question");
    await act(async () => {
      fireEvent.change(questionInput, { target: { value: "Updated Question" } });
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      type: "checkbox",
      questionText: "Updated Question",
      options: [""],
    });
  });

  test("does not allow adding empty options(negative)", async () => {
    render(<CheckboxQuestionBuilder onChange={() => {}} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Add Option"));
    });

    const inputs = screen.getAllByPlaceholderText(/Option/i);
    expect(inputs.length).toBe(2); // Only one new option should be added
    expect(inputs[1].value).toBe(""); // The new option should be empty
  });
});