import mongoose from "mongoose";
import * as messagesService from "../../src/services/message.service";
import { Message } from "../../src/models/message.model";

jest.mock("../../src/models/message.model", () => {
  return {
    Message: jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    })),
  };
});

jest.mock("../../src/services/message.service", () => {
  return {
    getAllMessages: jest.fn().mockImplementation(() => Message.find()),
    addMessage: jest.fn().mockImplementation(() => Message.prototype.save()),
  };
});

Message.find = jest.fn();
Message.prototype.save = jest.fn();

const messagesData = [
  {
    message: "Hello World!",
    handle: "bot1",
  },
  {
    message: "Hi there!",
    handle: "bot2",
  },
];

describe("Message Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllMessages", () => {
    it("should retrieve all messages", async () => {
      const fakeMessage = {
        id: new mongoose.Types.ObjectId(),
        ...messagesData,
      };
      Message.find = jest.fn().mockResolvedValue(fakeMessage);
      const messages = await messagesService.getAllMessages();

      expect(Message.find).toHaveBeenCalledTimes(1);
      expect(messages).toEqual(fakeMessage);
    });

    it("should return null if message not found", async () => {
      (Message.find as jest.Mock).mockResolvedValue(null);
      const messages = await messagesService.getAllMessages();

      expect(Message.find).toHaveBeenCalledTimes(1);
      expect(messages).toBeNull();
    });
  });

  describe("addMessage", () => {
    it("should create a new message", async () => {
      const fakeMessage = {
        id: new mongoose.Types.ObjectId(),
        ...messagesData,
      };
      Message.prototype.save.mockResolvedValue(fakeMessage);
      const newMessage = await messagesService.addMessage(messagesData);

      expect(Message.prototype.save).toHaveBeenCalled();
      expect(newMessage).toBe(fakeMessage);
    });
  });
});
