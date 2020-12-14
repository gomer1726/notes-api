const ERRORS = {
    "UNAUTHORIZED": {
        code: 401,
        message: "Action is unauthorized"
    },
    "NOT_FOUND": {
        code: 404,
        message: "Resource not found"
    },
    "INVALID_CREDENTIALS": {
        code: 401,
        message: "Invalid credentials"
    },
    "FORBIDDEN": {
        code: 403,
        message: "Forbidden"
    },
    "ALREADY_EXISTS": {
        code: 409,
        message: "Resource already exists"
    },
    "SERVER_ERROR": {
        code: 500,
        message: "Internal server error"
    },
};

exports.handleErrors = (err = null) => {
    return ERRORS[err || "SERVER_ERROR"];
}