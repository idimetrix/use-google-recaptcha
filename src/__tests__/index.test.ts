/**
 * @jest-environment jsdom
 */

import { useGoogleReCaptcha } from "../index";

// Mock React hooks
let mockState: any = {};
let mockSetState: jest.Mock;

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn((initial) => {
    mockState = initial;
    mockSetState = jest.fn((newState) => {
      mockState =
        typeof newState === "function" ? newState(mockState) : newState;
    });
    return [mockState, mockSetState];
  }),
  useCallback: jest.fn((fn) => fn),
}));

// Mock DOM methods
const mockGetElementById = jest.fn();
const mockCreateElement = jest.fn();
const mockAppendChild = jest.fn();
const mockSetAttribute = jest.fn();
const mockGetAttribute = jest.fn();

Object.defineProperty(document, "getElementById", {
  value: mockGetElementById,
  writable: true,
});

Object.defineProperty(document, "createElement", {
  value: mockCreateElement,
  writable: true,
});

Object.defineProperty(document, "body", {
  value: {
    appendChild: mockAppendChild,
    getAttribute: mockGetAttribute,
  },
  writable: true,
});

const mockElement = {
  setAttribute: mockSetAttribute,
  id: "",
  src: "",
  nonce: undefined,
  defer: false,
  async: false,
  onload: null,
  onerror: null,
};

describe("useGoogleReCaptcha", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = false;
    mockSetState = jest.fn();

    // Reset grecaptcha
    (window as any).grecaptcha = undefined;

    mockCreateElement.mockReturnValue(mockElement);
    mockGetElementById.mockReturnValue(null);
    mockGetAttribute.mockReturnValue(null);
  });

  it("should return execute function and executing state", () => {
    const result = useGoogleReCaptcha({ key: "test-key" });

    expect(result.execute).toBeInstanceOf(Function);
    expect(result.executing).toBe(false);
  });

  it("should return empty string when no key is provided", async () => {
    const result = useGoogleReCaptcha();

    const token = await result.execute();
    expect(token).toBe("");
  });

  it("should use environment variable for key", () => {
    process.env.REACT_APP_RECAPTHA_SITE_KEY = "env-key";

    const result = useGoogleReCaptcha();

    expect(result.execute).toBeInstanceOf(Function);

    delete process.env.REACT_APP_RECAPTHA_SITE_KEY;
  });

  it("should handle execution with grecaptcha available", async () => {
    const mockExecute = jest.fn().mockResolvedValue("mock-token");
    (window as any).grecaptcha = {
      execute: mockExecute,
      ready: jest.fn(),
      render: jest.fn(),
      enterprise: {} as any,
    };

    const result = useGoogleReCaptcha({ key: "test-key" });

    const token = await result.execute("test-action");

    expect(mockExecute).toHaveBeenCalledWith("test-key", {
      action: "test-action",
    });
    expect(token).toBe("mock-token");
  });

  it("should create script elements when executing without existing grecaptcha", async () => {
    const result = useGoogleReCaptcha({ key: "test-key" });

    // Start execution (this will trigger the script creation)
    const executePromise = result.execute("test-action");

    expect(mockCreateElement).toHaveBeenCalledWith("div");
    expect(mockCreateElement).toHaveBeenCalledWith("script");
    expect(mockSetAttribute).toHaveBeenCalledWith("data-badge", "inline");
    expect(mockSetAttribute).toHaveBeenCalledWith("data-size", "invisible");
    expect(mockSetAttribute).toHaveBeenCalledWith("data-sitekey", "test-key");

    // Resolve the promise by not waiting for it
    executePromise.catch(() => {}); // Prevent unhandled promise rejection
  });

  it("should handle script element that already exists", async () => {
    mockGetElementById.mockReturnValue(mockElement);

    const mockExecute = jest.fn().mockResolvedValue("mock-token");
    (window as any).grecaptcha = {
      execute: mockExecute,
      ready: jest.fn(),
      render: jest.fn(),
      enterprise: {} as any,
    };

    const result = useGoogleReCaptcha({ key: "test-key" });

    await result.execute("test-action");

    expect(mockCreateElement).not.toHaveBeenCalledWith("script");
    expect(mockExecute).toHaveBeenCalledWith("test-key", {
      action: "test-action",
    });
  });
});
