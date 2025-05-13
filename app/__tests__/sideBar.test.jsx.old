import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SideBar from "../components/studyCreator/sideBar";

describe("SideBar Component", () => {
  const mockQuestions = [
    { id: 1, type: "text" },
    { id: 2, type: "multipleChoice" },
    { id: 3, type: "checkbox" },
  ];
  const mockOnQuestionSelect = jest.fn();
  const mockOnAddQuestion = jest.fn();
  const mockSetQuestions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Positive Cases
  test("renders correctly with a list of questions", () => {
    render(
      <SideBar
        questions={mockQuestions}
        onQuestionSelect={mockOnQuestionSelect}
        onAddQuestion={mockOnAddQuestion}
        setQuestions={mockSetQuestions}
      />
    );

    expect(screen.getByText("Study Information")).toBeInTheDocument();
    expect(screen.getByText("Text Question 1")).toBeInTheDocument();
    expect(screen.getByText("Multiple Choice 2")).toBeInTheDocument();
    expect(screen.getByText("Checkbox Question 3")).toBeInTheDocument();
  });

  test("toggles add question menu when 'Add Item' button is clicked", () => {
    render(
      <SideBar
        questions={mockQuestions}
        onQuestionSelect={mockOnQuestionSelect}
        onAddQuestion={mockOnAddQuestion}
        setQuestions={mockSetQuestions}
      />
    );

    const addButton = screen.getByText("Add Item");
    fireEvent.click(addButton);
    expect(screen.getByText("Text Input")).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(screen.queryByText("Text Input")).not.toBeInTheDocument();
  });

  // Negative Cases
  test("handles empty questions array gracefully", () => {
    render(
      <SideBar
        questions={[]}
        onQuestionSelect={mockOnQuestionSelect}
        onAddQuestion={mockOnAddQuestion}
        setQuestions={mockSetQuestions}
      />
    );

    expect(screen.getByText("No questions added yet.")).toBeInTheDocument();
  });

  // Edge Cases
  test("renders correctly with only one question", () => {
    render(
      <SideBar
        questions={[{ id: 1, type: "text" }]}
        onQuestionSelect={mockOnQuestionSelect}
        onAddQuestion={mockOnAddQuestion}
        setQuestions={mockSetQuestions}
      />
    );

    expect(screen.getByText("Text Question 1")).toBeInTheDocument();
  });

  test("handles duplicate question IDs gracefully", () => {
    const duplicateQuestions = [
      { id: 1, type: "text" },
      { id: 1, type: "multipleChoice" },
    ];

    render(
      <SideBar
        questions={duplicateQuestions}
        onQuestionSelect={mockOnQuestionSelect}
        onAddQuestion={mockOnAddQuestion}
        setQuestions={mockSetQuestions}
      />
    );

    expect(screen.getByText("Text Question 1")).toBeInTheDocument();
    expect(screen.getByText("Multiple Choice 2")).toBeInTheDocument();
  });

  // Boundary Cases
  test("renders correctly with a very large questions array", () => {
    const largeQuestions = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      type: "text",
    }));

    render(
      <SideBar
        questions={largeQuestions}
        onQuestionSelect={mockOnQuestionSelect}
        onAddQuestion={mockOnAddQuestion}
        setQuestions={mockSetQuestions}
      />
    );

    expect(screen.getByText("Text Question 1")).toBeInTheDocument();
    expect(screen.getByText("Text Question 1000")).toBeInTheDocument();
  });

  test("renders correctly with an empty questions array", () => {
    render(
      <SideBar
        questions={[]}
        onQuestionSelect={mockOnQuestionSelect}
        onAddQuestion={mockOnAddQuestion}
        setQuestions={mockSetQuestions}
      />
    );

    expect(screen.getByText("No questions added yet.")).toBeInTheDocument();
  });
});