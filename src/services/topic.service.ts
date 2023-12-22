import { Topic } from "../models/topic.model.ts";

export async function getAllTopics() {
  return await Topic.find();
}

export async function getTodaysTopic() {
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  return await Topic.findOne({ forDate: { $gte: today } }).select(
    "-_id -__v -forDate"
  );
}
