import { apiEndpoint } from '../config'
import { Fruit } from '../types/Fruit';
import { CreateFruitRequest } from '../types/CreateFruitRequest';
import Axios from 'axios'
import { UpdateFruitRequest } from '../types/UpdateFruitRequest';

export async function getFruits(idToken: string): Promise<Fruit[]> {
  console.log('Fetching Fruits')

  const response = await Axios.get(`${apiEndpoint}/fruits`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Fruits:', response.data)
  return response.data.items
}

export async function createFruit(
  idToken: string,
  newFruit: CreateFruitRequest
): Promise<Fruit> {
  const response = await Axios.post(`${apiEndpoint}/fruits`,  JSON.stringify(newFruit), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchFruit(
  idToken: string,
  fruitId: string,
  updatedFruit: UpdateFruitRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/fruits/${fruitId}`, JSON.stringify(updatedFruit), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteFruit(
  idToken: string,
  fruitId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/fruits/${fruitId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  fruitId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/fruits/${fruitId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
