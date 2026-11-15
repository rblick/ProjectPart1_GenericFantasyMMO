const getErrorMessage = (err) => {
  if (err?.code === 11000 || err?.code === 11001) {
    return "Username or email already exists";
  }

  if (err?.name === "ValidationError" && err.errors) {
    return Object.values(err.errors)
      .map((validationError) => validationError.message)
      .join(", ");
  }

  if (err?.name === "CastError") return "Invalid value supplied";
  return "Unable to complete the request";
};

export default { getErrorMessage };
