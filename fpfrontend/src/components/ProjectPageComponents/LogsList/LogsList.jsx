import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { act } from "react";
import LogsList from "../components/ProjectPageComponents/LogsList/LogsList";
import projectService from "../services/projectService";

jest.mock("../services/projectService", () => ({
  getProjectLogsByProjectId: jest.fn(),
  createProjectLog: jest.fn(),
}));

const mockProjectLogs = [
  {
    username: "John Doe",
    creationDate: "2024-07-10T08:30:00Z",
    type: "PROJECT_DATA",
    content: "Sample log content",
  },
  {
    username: "Jane Smith",
    creationDate: "2024-07-09T14:45:00Z",
    type: "PROJECT_MEMBERS",
    content: "Another log entry",
  },
];

beforeEach(() => {
  projectService.getProjectLogsByProjectId.mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockProjectLogs),
  });
  projectService.createProjectLog.mockResolvedValue({
    status: 204,
  });
});

describe("LogsList Component", () => {
  it("creates a new project log and updates logs list", async () => {
    await act(async () => {
      render(
        <IntlProvider locale="en" messages={{ addLog: "Add Log" }}>
          <LogsList id="1" />
        </IntlProvider>
      );

      fireEvent.click(screen.getByText("Add Log"));

      fireEvent.change(screen.getByLabelText("Content"), {
        target: { value: "New log entry" },
      });

      fireEvent.click(screen.getByText("Submit"));

      await waitFor(() => {
        expect(projectService.createProjectLog).toHaveBeenCalledWith("1", {
          content: "New log entry",
        });
      });

      await waitFor(() => {
        expect(screen.getByText("New log entry")).toBeInTheDocument();
      });
    });
  });
});
