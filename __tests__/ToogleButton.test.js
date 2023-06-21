/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ToggleButton from "../src/components/ToggleButton";

test("renders ToggleButton without errors", () => {
  render(<ToggleButton left="Left" right="Right" onToggleChange={() => {}} />);
});


test("left option is initially selected", () => {
  render(<ToggleButton left="Left" right="Right" onToggleChange={() => {}} />);

  const leftOption = screen.getByText("Left");
  expect(leftOption).toHaveClass("text-box-active");

  const rightOption = screen.getByText("Right");
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

  const rightOption = screen.getByText("Right");
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

  const leftOption = screen.getByText("Left");
  fireEvent.click(leftOption);

  expect(toggleState).toBe(true);
  expect(leftOption).toHaveClass("text-box-active");
});