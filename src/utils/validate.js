import {
    parseISO,
    differenceInYears,
    add,
    addYears,
    subMonths,
    min,
    isAfter,
    isBefore,
    areEqual,
    isSameDay,
} from 'date-fns';

export default function login_validate(values) {
    const errors = {};

    /* Checking if the email is valid. */
    if (!values.email) {
        errors.email = 'Required';
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address';
    }

    /* Checking if the password is valid. */
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 4) {
        errors.password = 'Password must be at least 8 characters';
    } else if (values.password.includes(' ')) {
        errors.password = 'Password must not contain spaces';
    }

    return errors;
}

export function register_validate(values) {
    const errors = {};

    /* Checking if the name field is empty. */
    if (!values.name) {
        errors.name = 'Required';
    }

    /* Checking if the email is valid. */
    if (!values.email) {
        errors.email = 'Required';
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address';
    }

    /* Checking if the password is valid. */
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 4) {
        errors.password = 'Password must be at least 8 characters';
    } else if (values.password.includes(' ')) {
        errors.password = 'Password must not contain spaces';
    }

    /* Checking if the date of birth is valid. */
    if (!values.dateOfBirth) {
        errors.dateOfBirth = 'Required';
    } else if (values.dateOfBirth >= new Date().toISOString().split('T')[0]) {
        errors.dateOfBirth = 'Date of birth must be in the past';
    } else if (values.dateOfBirth < '1900-01-01') {
        errors.dateOfBirth = 'Date of birth must be after 1900';
    }

    const dob = parseISO(values.dateOfBirth);
    const age = differenceInYears(new Date(), dob);
    if (age < 17) {
        errors.dateOfBirth = 'Users must be at least 17 years old to be added.';
    }

    /* Checking if the role is empty. */
    if (!values.role) {
        errors.role = `${values.role} is not a valid role`;
    }

    if (!values.department) {
        errors.department = `${values.department} is not a valid department`;
    }

    return errors;
}

export function update_user_validate(values) {
    const errors = {};

    /* Checking if the name field is empty. */
    if (!values.name) {
        errors.name = 'Required';
    }

    /* Checking if the email is valid. */
    if (!values.email) {
        errors.email = 'Required';
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address';
    }

    if (values.password) {
        if (values.password.length < 4) {
            errors.password = 'Password must be at least 8 characters';
        } else if (values.password.includes(' ')) {
            errors.password = 'Password must not contain spaces';
        }
    }

    /* Checking if the date of birth is valid. */
    if (!values.dateOfBirth) {
        errors.dateOfBirth = 'Required';
    } else if (values.dateOfBirth >= new Date().toISOString().split('T')[0]) {
        errors.dateOfBirth = 'Date of birth must be in the past';
    } else if (values.dateOfBirth < '1900-01-01') {
        errors.dateOfBirth = 'Date of birth must be after 1900';
    }

    const dob = parseISO(values.dateOfBirth);
    const age = differenceInYears(new Date(), dob);
    if (age < 17) {
        errors.dateOfBirth = 'Users must be at least 17 years old to be added.';
    }

    /* Checking if the role is empty. */
    if (!values.role) {
        errors.role = `${values.role} is not a valid role`;
    }

    if (!values.department) {
        errors.department = `${values.department} is not a valid department`;
    }

    return errors;
}

export function update_profile_validate(values) {
    const errors = {};

    /* Checking if the name field is empty. */
    if (!values.name) {
        errors.name = 'Required';
    }

    /* Checking if the email is valid. */
    if (!values.email) {
        errors.email = 'Required';
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address';
    }

    if (values.password) {
        if (values.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        } else if (values.password.includes(' ')) {
            errors.password = 'Password must not contain spaces';
        } else if (
            !/[A-Z]/.test(values.password) ||
            !/[a-z]/.test(values.password) ||
            !/[0-9]/.test(values.password) ||
            !/[!@#$%^&*]/.test(values.password)
        ) {
            errors.password =
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
        }
    }

    /* Checking if the date of birth is valid. */
    if (!values.dateOfBirth) {
        errors.dateOfBirth = 'Required';
    } else if (values.dateOfBirth >= new Date().toISOString().split('T')[0]) {
        errors.dateOfBirth = 'Date of birth must be in the past';
    } else if (values.dateOfBirth < '1900-01-01') {
        errors.dateOfBirth = 'Date of birth must be after 1900';
    }

    const dob = parseISO(values.dateOfBirth);
    const age = differenceInYears(new Date(), dob);
    if (age < 17) {
        errors.dateOfBirth = 'Users must be at least 17 years old to be added.';
    }

    /* Checking if the role is empty. */
    if (!values.role) {
        errors.role = `${values.role} is not a valid role`;
    }

    if (!values.department) {
        errors.department = `${values.department} is not a valid department`;
    }

    return errors;
}

export function add_category_validate(values) {
    const errors = {};

    /* Checking if the name field is empty. */
    if (!values.name) {
        errors.name = 'Required';
    }

    return errors;
}

export function add_post_validate(values) {
    const errors = {};

    if (!values.title) {
        errors.title = 'Required';
    }

    if (!values.category) {
        errors.category = 'Required';
    }

    if (!values.desc) {
        errors.desc = 'Required';
    }

    return errors;
}

export function update_post_validate(values) {
    const errors = {};

    if (!values.title) {
        errors.title = 'Required';
    }

    if (!values.desc) {
        errors.desc = 'Required';
    }

    return errors;
}

export function comment_validate(values) {
    const errors = {};

    if (!values.comment) {
        errors.comment = 'Required';
    }

    return errors;
}

export function add_closure_validate(values) {
    const errors = {};

    if (!values.startDate) {
        errors.startDate = 'Required';
    }

    const maxStartDate = add(new Date(), { months: -1 });
    const parsedStartDate = new Date(values.startDate);
    if (
        isBefore(parsedStartDate, maxStartDate) ||
        isAfter(parsedStartDate, add(new Date(), { years: 1 }))
    ) {
        errors.startDate =
            'Start date must be within the last month and today or later within 1 year.';
    }

    if (!values.initialClosureDate) {
        errors.initialClosureDate = 'Required';
    }

    const parsedInitialClosureDate = new Date(values.initialClosureDate);
    if (
        isBefore(parsedInitialClosureDate, new Date()) ||
        isAfter(parsedInitialClosureDate, add(new Date(), { years: 1 }))
    ) {
        errors.initialClosureDate =
            'Initial closure date must be today or later and within 1 year.';
    }

    if (!values.finalClosureDate) {
        errors.finalClosureDate = 'Required';
    }

    const parsedFinalClosureDate = new Date(values.finalClosureDate);
    if (
        isBefore(parsedFinalClosureDate, new Date()) ||
        isAfter(parsedFinalClosureDate, add(new Date(), { years: 1 }))
    ) {
        errors.finalClosureDate =
            'Final closure date must be today or within 1 year.';
    }

    if (isAfter(parsedInitialClosureDate, parsedFinalClosureDate)) {
        errors.initialClosureDate =
            'Initial closure date must be earlier than final closure date';
    }

    if (
        isAfter(parsedStartDate, parsedInitialClosureDate) ||
        isAfter(parsedStartDate, parsedFinalClosureDate)
    ) {
        errors.startDate =
            'Start date must be earlier than initial and final closure dates';
    }

    return errors;
}

export function closure_validate(values) {
    const errors = {};

    if (!values.startDate) {
        errors.startDate = 'Required';
    }

    if (!values.initialClosureDate) {
        errors.initialClosureDate = 'Required';
    }

    if (!values.finalClosureDate) {
        errors.finalClosureDate = 'Required';
    }

    return errors;
}
