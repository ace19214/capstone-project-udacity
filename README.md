# Fruit Application

![fruit-application](https://user-images.githubusercontent.com/49590959/209499848-a3d1d6c1-eb60-4dfe-a5ac-98cda8532173.PNG)

Functions to be implemented
To implement this project, you need to implement the following functions and configure them in the serverless.yml file:

Auth - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

GetFruits - should return all Fruits for a current user. A user id can be extracted from a JWT token that is sent by the frontend
It should return data that looks like this:

{
  "items": [
    {
      "FruitId": "323",
      "createdAt": "2022-12-26T20:01:45.424Z",
      "name": "Apple",
      "dueDate": "2022-12-26T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/apple.png"
    },
    {
      "FruitId": "456",
      "createdAt": "2022-12-26T20:01:45.424Z",
      "name": "Tomato",
      "dueDate": "2022-12-26T20:01:45.424Z",
      "done": true,
      "attachmentUrl": "http://example.com/tomato.png"
    },
  ]
}




CreateFruit - should create a new Fruit for a current user. A shape of data send by a client application to this function can be found in the CreateFruitRequest.ts file
It receives a new Fruit item to be created in JSON format that looks like this:

{
  "createdAt": "2022-12-26T20:01:45.424Z",
  "name": "Apple",
  "dueDate": "2022-12-26T20:01:45.424Z",
  "done": false,
  "attachmentUrl": "http://example.com/apple.png"
}
It should return a new Fruit item that looks like this:

{
  "item": {
    "FruitId": "323",
    "createdAt": "2022-12-26T20:01:45.424Z",
    "name": "Apple",
    "dueDate": "2022-12-26T20:01:45.424Z",
    "done": false,
    "attachmentUrl": "http://example.com/apple.png"
  }
}




UpdateFruit - should update a Fruit item created by a current user. A shape of data send by a client application to this function can be found in the UpdateFruitRequest.ts file
It receives an object that contains three fields that can be updated in a Fruit item:

{
  "name": "Apple",
  "dueDate": "2022-12-26T20:01:45.424Z",
  "done": true
}
The id of an item that should be updated is passed as a URL parameter.
It should return an empty body.





DeleteFruit - Should delete a Fruit item created by a current user 
           - Delete S3 bucket object belong to this Fruit item (if exist). Expects an id of a Fruit item to remove.
It should return an empty body.





GenerateUploadUrl - returns a pre-signed URL that can be used to upload an attachment file for a Fruit item.
It should return a JSON object that looks like this:

{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-1.amazonaws.com/apple.png"
}
All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the resources section of the serverless.yml file such as DynamoDB table and S3 bucket.
