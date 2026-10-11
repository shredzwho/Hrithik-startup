/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("athlete_sponsorship_applications");

  const existing = collection.fields.getByName("sport");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("sport"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "sport"
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("athlete_sponsorship_applications");
    collection.fields.removeByName("sport");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})