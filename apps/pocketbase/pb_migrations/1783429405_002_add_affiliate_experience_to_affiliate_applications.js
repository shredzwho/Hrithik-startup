/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("affiliate_applications");

  const existing = collection.fields.getByName("affiliate_experience");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("affiliate_experience"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "affiliate_experience"
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("affiliate_applications");
    collection.fields.removeByName("affiliate_experience");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})