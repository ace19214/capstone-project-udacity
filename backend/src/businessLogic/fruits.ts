import { FruitAccess } from "../dataLayer/FruitAccess";
import { CreateFruitRequest } from "../requests/CreateFruitRequest";
import { UpdateFruitRequest } from "../requests/UpdateFruitRequest";
import { createUrl, generateUploadUrl, deleteUrl } from "../helpers/attachmentUtils";

import * as uuid from 'uuid';

const fruitAccess = new FruitAccess();

export async function getAllFruits(userId: string) {
  return await fruitAccess.getAllFruits(userId);
}

export async function createFruit(createFruitRequest: CreateFruitRequest, userId: string) {
  const fruitId = uuid.v4();
  return await fruitAccess.createFruit({
    userId: userId,
    fruitId: fruitId,
    createdAt: new Date().getTime().toString(),
    name: createFruitRequest.name,
    dueDate: createFruitRequest.dueDate,
    done: false
  });
}

export async function updateFruit(updateFruitRequest: UpdateFruitRequest, userId: string, fruitId: string) {
  return await fruitAccess.updateFruit({
    name: updateFruitRequest.name,
    dueDate: updateFruitRequest.dueDate,
    done: updateFruitRequest.done
  }, userId, fruitId);
}

export async function deleteFruit(userId: string, fruitId: string) {
  const currentFruit = await fruitAccess.getFruitForUserById(userId, fruitId);
  const attachmentUrl = currentFruit.attachmentUrl;
  if (attachmentUrl) {
    await deleteUrl(fruitId);
  }
  return await fruitAccess.deleteFruit(userId, fruitId);
}

export async function generateUrl(fruitId: string) {
  return await generateUploadUrl(fruitId);
}

export async function updateUrlForFruit(userId: string, fruitId: string) {
  const attachmentUrl = createUrl(fruitId);
  return await fruitAccess.updateUrlForFruit(attachmentUrl, userId, fruitId);
}