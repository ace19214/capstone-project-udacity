/**
 * Fields in a request to update a single Fruit item.
 */
export interface UpdateFruitRequest {
  name: string
  dueDate: string
  done: boolean
}