export const signupValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: "Name is required",
        },
        isString: {
            errorMessage: "Name should be a string",
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Password is required",
        },
        isString: {
            errorMessage: "Password should be a string",
        },
        isLength: {
            options: { min: 6 },
            errorMessage: "Password should be at least 6 chars long",
        },
    },
    email: {
        notEmpty: {
            errorMessage: "Email is required",
        },
        isEmail: {
            errorMessage: "Invalid email",
        },
    },
};

export const loginValidationSchema = {
    password: {
        notEmpty: {
            errorMessage: "Password is required",
        },
        isString: {
            errorMessage: "Password should be a string",
        },
        isLength: {
            options: { min: 6 },
            errorMessage: "Password should be at least 6 chars long",
        },
    },
    email: {
        notEmpty: {
            errorMessage: "Email is required",
        },
        isEmail: {
            errorMessage: "Invalid email",
        },
    },
};

export const addBookValidationSchema = {
    title: {
        notEmpty: {
            errorMessage: "Title is required",
        },
        isString: {
            errorMessage: "Title should be a string",
        },
        isLength: {
            options: { max: 200 },
        },
    },
    description: {
        notEmpty: {
            errorMessage: "Description is required",
        },
        isString: {
            errorMessage: "Description should be a string",
        },
        isLength: {
            options: { max: 500 },
        },
    },
    author: {
        notEmpty: {
            errorMessage: "Author is required",
        },
        isString: {
            errorMessage: "Author should be a string",
        },
    },
    publicationdate: {
        notEmpty: {
            errorMessage: "Publication date is required",
        },
        isDate: {
            errorMessage: "Invalid date",
        },
    },
    pages: {
        notEmpty: {
            errorMessage: "Pages is required",
        },
        isInt: {
            errorMessage: "Pages should be a number",
        },
    },
};
