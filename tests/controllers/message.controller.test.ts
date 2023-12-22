// message.controller.test.ts
import * as messageService from "../../src/services/message.service";
import { getAllMessages } from "../../src/controllers/message.controller";
import { createMockContext } from "@shopify/jest-koa-mocks";

jest.mock("../../src/services/message.service");

describe("Message Controller", () => {
  it("should get all messages and set them in the context body", async () => {
    const mockMessages = [
      { message: "First message", handle: "user1" },
      { message: "Second message", handle: "user2" },
    ];
    (messageService.getAllMessages as jest.Mock).mockResolvedValue(
      mockMessages
    );
    const ctx = createMockContext({
      state: {},
    });

    await getAllMessages(ctx, () => Promise.resolve());

    expect(ctx.body).toEqual(mockMessages);
  });

  it("should handle the error when the messageService throws", async () => {
    (messageService.getAllMessages as jest.Mock).mockRejectedValue(
      new Error("Error fetching messages")
    );
    const ctx = createMockContext({
      state: {},
    });
    const next = jest.fn();

    let error;
    try {
      await getAllMessages(ctx, next);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(ctx.body).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });
});
