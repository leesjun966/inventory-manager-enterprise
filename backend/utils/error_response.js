/**
 * Respond to various error for crud operation
 * @param {*} error     Error
 * @param {*} respond   API reponse
 */
const handleError = (error, respond) => {
  switch (error.name) {
    // Not found in table
    case "SequelizeEmptyResultError":
      respond
        .status(422)
        .send(JSON.stringify({ Status: "Category Does Not Exist" }));
      break;
    // Foreign Key does not exist
    case "SequelizeForeignKeyConstraintError":
      respond.status(422).send(
        JSON.stringify({
          Status: "Employee, Supplier, or Category Does Not Exist"
        })
      );
      break;
    case "LoggingError":
      respond.status(400).send(
        JSON.stringify({
          Status: "Log function error, please contact sys admin"
        })
      );
    // Other
    default:
      respond.status(500).send(JSON.stringify({ Status: error.message }));
      break;
  }
};

module.exports = { handleError: handleError };
