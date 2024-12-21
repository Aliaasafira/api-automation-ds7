const { test, request, expect } = require ("@playwright/test")
const { Ajv } = require("ajv");

const ajv = new Ajv()

//GET REQUEST
test ('Test Case 1', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/2');
    expect(response.status()).toBe(200)

    const responseData = await response.json()

      expect(responseData.data.id).toBe(2)
      expect(responseData.data.email).toBe("janet.weaver@reqres.in")
      expect(responseData.data.first_name).toBe("Janet")
      expect(responseData.data.last_name).toBe("Weaver")
      expect(responseData.data.avatar).toBe("https://reqres.in/img/faces/2-image.jpg")

    const valid = ajv.validate(require('./jsonschema/get-object-schema.json'), responseData)
     if (!valid){
       console.error("AJV Validation Errors:", ajv.errorsText());
     }

     expect(valid).toBe(true);

});

//POST REQUEST
test ('Test Case 2', async ({ request }) => {
   const userData = {
      "name" : "Safira",
      "job" : "Software Engineer"
   }

   const response = await request.post('https://reqres.in/api/users', {
      json: userData,
   });

   console.log(await response.json());

   expect(response.status()).toBe(201)

   const responseData = await response.json();

   const valid = ajv.validate(require('./jsonschema/post-object-schema.json'), responseData)
   if (!valid){
    console.error("AJV Validation Errors:", ajv.errorsText());
  }

    // Check the status code of the response
    if (response.status() === 201) {
      console.log("User created successfully!");
    } else {
      console.error(`Error creating user: ${await response.text()}`);
    }
  
});

//PUT REQUEST
test ('Test Case 3', async ({ request }) => {
  const updatedUserData = {
    "name" : "Safira",
    "job" : "QA Engineer"
  };

  const response = await request.put('https://reqres.in/api/users/2', {
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(updatedUserData),
 });

 expect(response.status()).toBe(200);

 const responseData = await response.json();

 const valid = ajv.validate(require('./jsonschema/put-object-schema.json'), responseData)
   if (!valid){
    console.error("AJV Validation Errors:", ajv.errorsText());
  }

  console.log(await response.json());

});

//DELETE REQUEST
test ('Test Case 4', async ({ request }) => {
  
  const url = 'https://reqres.in/api/users/2';

  const response = await request.delete(url);

  expect(response.status()).toBe(204);

  if (response.status() === 204) {
    console.log("User deleted successfully!");
  } else {
    console.error(`Error deleting user: ${await response.text()}`);
  }

  const valid = ajv.validate(require('./jsonschema/delete-object-schema.json'), response)
  if (!valid){
   console.error("AJV Validation Errors:", ajv.errorsText());
 }

});

