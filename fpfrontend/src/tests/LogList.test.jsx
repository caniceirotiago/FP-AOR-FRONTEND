
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IntlProvider } from "react-intl";
import LogsList from "../components/ProjectPageComponents/LogsList/LogsList";
import projectService from "../services/projectService";

jest.mock("../services/projectService");

const mockProjectLogs = [
  {
    username: "John Doe",
    creationDate: "2024-07-10T08:30:00Z",
    type: "Info",
    content: "Sample log content",
  },
  {
    username: "Jane Smith",
    creationDate: "2024-07-09T14:45:00Z",
    type: "Warning",
    content: "Another log entry",
  },
];

beforeEach(() => {
  projectService.getProjectLogsByProjectId.mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockProjectLogs),
  });
});

describe("LogsList Component", () => {
  it("renders project logs correctly", async () => {
    render(
      <IntlProvider locale="en">
        <LogsList id="1" />
      </IntlProvider>
    );

    // Wait for project logs to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    expect(screen.getByText("Sample log content")).toBeInTheDocument();
    expect(screen.getByText("Another log entry")).toBeInTheDocument();
  });

  it("displays the log modal when the 'Add' button is clicked", () => {
    render(
      <IntlProvider locale="en">
        <LogsList id="1" />
      </IntlProvider>
    );

    fireEvent.click(screen.getByText("Add"));

    expect(screen.getByText("Create New Log")).toBeInTheDocument();
  });

  it("creates a new project log and updates logs list", async () => {
    render(
      <IntlProvider locale="en">
        <LogsList id="1" />
      </IntlProvider>
    );

    fireEvent.click(screen.getByText("Add"));

    // Simulate typing in the log modal form
    fireEvent.change(screen.getByLabelText("Log Content"), {
      target: { value: "New log entry" },
    });

    fireEvent.click(screen.getByText("Save"));

    // Ensure projectService.createProjectLog is called
    await waitFor(() => {
      expect(projectService.createProjectLog).toHaveBeenCalled();
    });

    // Ensure the new log entry appears in the logs list
    await waitFor(() => {
      expect(screen.getByText("New log entry")).toBeInTheDocument();
    });
  });
});

