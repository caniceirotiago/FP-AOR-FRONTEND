
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IntlProvider } from "react-intl";
import LogsList from "../components/ProjectPageComponents/LogsList/LogsList";
import LogModal from "../components/modals/LogModal";
import projectService from "../services/projectService";

jest.mock("../components/modals/LogModal", () => {
  return jest.fn(({ isOpen, onClose, onCreateLog }) => {
    if (!isOpen) return null;

    return (
      <div data-testid="mocked-log-modal">
        Mocked Log Modal Content
        <button onClick={onClose}>Close</button>
        <form onSubmit={(e) => {}}>
          <div>
            <label htmlFor="logContent">Content</label>
            <textarea
              id="logContent"
              onChange={(e) => onCreateLog(e.target.value)}
              aria-label="Content"
              rows={4} // Adjust as per your styling
              cols={50} // Adjust as per your styling
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  });
});





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
});

describe("LogsList Component", () => {
  it("creates a new project log and updates logs list", async () => {
    render(
      <IntlProvider locale="en">
        <LogsList id="1" />
      </IntlProvider>
    );

    fireEvent.click(screen.getByText("", { selector: '[data-text="addLog"]' }));

    // Simulate typing in the log modal form
    fireEvent.change(screen.getByTestId("mocked-log-modal").querySelector('textarea'), {
      target: { value: "New log entry" },
    });
    
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(projectService.createProjectLog).toHaveBeenCalledWith("1", {
        content: "New log entry",
      });
    });

    // Ensure the new log entry appears in the logs list
    await waitFor(() => {
      expect(screen.getByText("New log entry")).toBeInTheDocument();
    });
  });
});