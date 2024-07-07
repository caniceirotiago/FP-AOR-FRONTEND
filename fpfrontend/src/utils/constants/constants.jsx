// project states
export const PROJECT_STATES = {
  PLANNING: "PLANNING",
  READY: "READY",
  IN_PROGRESS: "IN_PROGRESS",
  CANCELLED: "CANCELLED",
  FINISHED: "FINISHED",
};

// project roles
export const PROJECT_ROLES = {
  NORMAL_USER: "NORMAL_USER",
  PROJECT_MANAGER: "PROJECT_MANAGER",
};

// task states
export const TASK_STATES = {
  PLANNED: "PLANNED",
  IN_PROGRESS: "IN_PROGRESS",
  FINISHED: "FINISHED",
};

// app role mapping
export const roles = ["Administrator", "Standard User"];

export const roleMapping = {
  1: "Administrator",
  2: "Standard User",
  "Administrator": 1,
  "Standard User": 2,
};
