module.exports = (mainModel, secModel, counterFieldName) => {
  const newModel = [];
  let secDocsCounter = 0;

  mainModel.map(mainDoc => {
    while (
      secDocsCounter < secModel.length &&
      secModel[secDocsCounter]._id.toString() < mainDoc._id.toString()
    )
      secDocsCounter++;

    const tempDoc = { ...mainDoc };
    tempDoc[counterFieldName] =
      secDocsCounter < secModel.length &&
      secModel[secDocsCounter]._id.toString() === mainDoc._id.toString()
        ? secModel[secDocsCounter++].ref
        : 0;

    newModel.push(tempDoc);
  });
  return newModel;
};
