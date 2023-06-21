/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ToggleButton from "../src/components/ToggleButton";

test("renders ToggleButton without errors", () => {
  render(<ToggleButton left="Left" right="Right" onToggleChange={() => {}} />);
});


test("left option is initially selected", () => {
  render(<ToggleButton left="Left" right="Right" onToggleChange={() => {}} />);

  const leftOption = screen.getByTestId("left-option");
  expect(leftOption).toHaveClass("text-box-active");

  const rightOption = screen.getByTestId("right-option");
  expect(rightOption).toHaveClass("text-box");
});

test("clicking right option updates state and applies active class", () => {
  let toggleState = true;
  const handleToggleChange = (state) => {
    toggleState = state;
  };

  render(
    <ToggleButton
      left="Left"
      right="Right"
      onToggleChange={handleToggleChange}
    />
  );

  const rightOption = screen.getByTestId("right-option");
  fireEvent.click(rightOption);

  expect(toggleState).toBe(false);
  expect(rightOption).toHaveClass("text-box-active");
});

test("clicking left option updates state and applies active class", () => {
  let toggleState = false;
  const handleToggleChange = (state) => {
    toggleState = state;
  };

  render(
    <ToggleButton
      left="Left"
      right="Right"
      onToggleChange={handleToggleChange}
    />
  );

  const leftOption = screen.getByTestId("left-option");
  fireEvent.click(leftOption);

  expect(toggleState).toBe(true);
  expect(leftOption).toHaveClass("text-box-active");
});