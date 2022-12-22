import { CreateFruitRequest } from "../requests/CreateFruitRequest";
import * as uuid from 'uuid'
import { FruitAccess } from "../dataLayer/fruitAccess";
import { FruitItem } from "../models/FruitItem";
import { parseUserId } from "../auth/utils";
import { UpdateFruitRequest } from "../requests/UpdateFruitRequest";
import { FruitUpdate } from "../models/FruitUpdate";

const fruitAccess = new FruitAccess();
export function createFruit(CreateFruitRequest: CreateFruitRequest, jwtToken: string) {
    const userId = parseUserId(jwtToken);
    const fruitId = uuid.v4();
    const s3BucketName = process.env.S3_BUCKET_NAME
    return fruitAccess.createFruit({
        userId: userId,
        fruitId: fruitId,
        createdAt: new Date().getTime().toString(),
        done: false,
        ...CreateFruitRequest,
    });
    
}

export function getAllFruit(jwtToken: string): Promise<FruitItem[]> {
    return fruitAccess.getAllFruit(parseUserId(jwtToken));
}

export function updateFruit(updateFruitRequest: UpdateFruitRequest, fruitId: string, jwtToken: string): Promise<FruitUpdate> {
    return fruitAccess.updateFruit(updateFruitRequest, fruitId, parseUserId(jwtToken));
}

export function deleteFruit(fruitId: string, jwtToken: string): Promise<string>{
    return fruitAccess.deleteFruit(fruitId, parseUserId(jwtToken));
}

export function generateUploadUrl(fruitId: string): Promise<string>{
    return fruitAccess.generateUploadUrl(fruitId);
}