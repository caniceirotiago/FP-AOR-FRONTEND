import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserRoleEditor from "../components/reactSelect/UserRoleEditor";
import userService from "../services/userService";
import { IntlProvider } from "react-intl";

// Mock the userService
jest.mock("../services/userService");

const messages = {
  userManagementTitle: "User Management",
  searchPlaceholder: "Search...",
  userRoleSuccess: "User role updated successfully",
  userRoleFailure: "Failed to update user role",
};

const mockUsers = [
  { id: 1, username: "user1", photo: "photo1.jpg", role: "Standard User" },
  { id: 2, username: "user2", photo: "photo2.jpg", role: "Administrator" },
];

describe("UserRoleEditor Component", () => {
  beforeEach(async () => {
    userService.fetchUsersListBasicInfo.mockResolvedValue({
      status: 200,
      json: async () => mockUsers,
    });

    render(
      <IntlProvider locale="en" messages={messages}>
        <UserRoleEditor />
      </IntlProvider>
    );

    await waitFor(() =>
      expect(userService.fetchUsersListBasicInfo).toHaveBeenCalled()
    );
  });

  it("renders the user list correctly", async () => {
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.getByText("user2")).toBeInTheDocument();
    });
  });

  it("filters the user list based on search input", async () => {
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "user1" },
    });
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.queryByText("user2")).not.toBeInTheDocument();
    });
  });
});
