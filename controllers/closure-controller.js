import Closure from 'models/Closure';
import {
    add,
    addYears,
    subMonths,
    min,
    isAfter,
    parseISO,
    isBefore,
    areEqual,
    isSameDay,
    startOfToday,
} from 'date-fns';

export const GetClosureDate = async (req, res) => {
    try {
        const closure = await Closure.findOne();

        return res.status(200).json(closure);
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};

export const AddClosureDate = async (req, res) => {
    const { startDate, initialClosureDate, finalClosureDate } = req.body;

    try {
        const existingClosure = await Closure.findOne();

        if (existingClosure) {
            return res
                .status(400)
                .json('Closure Date Already Exist, Please Update Instead.');
        }

        // Calculate the maximum start date
        const maxStartDate = add(new Date(), { months: -1 });

        // Validate start date
        const parsedStartDate = new Date(startDate);
        if (
            isBefore(parsedStartDate, maxStartDate) ||
            isAfter(parsedStartDate, add(new Date(), { years: 1 }))
        ) {
            return res
                .status(400)
                .json(
                    'Start date must be within the last month and today or later within 1 year.'
                );
        }

        // Validate initial closure date
        const parsedInitialClosureDate = new Date(initialClosureDate);
        if (
            isBefore(parsedInitialClosureDate, startOfToday()) ||
            isAfter(parsedInitialClosureDate, add(new Date(), { years: 1 }))
        ) {
            return res
                .status(400)
                .json(
                    'Initial closure date must be today or later and within 1 year.'
                );
        }

        // Validate final closure date
        const parsedFinalClosureDate = new Date(finalClosureDate);
        if (
            isBefore(parsedFinalClosureDate, startOfToday()) ||
            isAfter(parsedFinalClosureDate, add(new Date(), { years: 1 }))
        ) {
            return res
                .status(400)
                .json(
                    'Final closure date must be today or later and within 1 year.'
                );
        }

        // Validate initial and final closure dates
        if (isAfter(parsedInitialClosureDate, parsedFinalClosureDate)) {
            return res
                .status(400)
                .json(
                    'Initial closure date must be earlier or the same as final closure date'
                );
        }

        // Validate start date against initial and final closure dates
        if (
            isAfter(parsedStartDate, parsedInitialClosureDate) ||
            isAfter(parsedStartDate, parsedFinalClosureDate)
        ) {
            return res
                .status(400)
                .json(
                    'Start date must be earlier than initial and final closure dates'
                );
        }

        const newClosure = new Closure({
            startDate: startDate,
            initialClosureDate: initialClosureDate,
            finalClosureDate: finalClosureDate,
        });

        const closure = await newClosure.save();
        return res.status(201).json(closure);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const UpdateClosureDate = async (req, res) => {
    const { id } = req.query;
    const { initialClosureDate, finalClosureDate, startDate } = req.body;

    try {
        const existingClosure = await Closure.findById(id);

        if (!existingClosure) {
            return res.status(400).json('Closure Date Does Not Exist');
        }

        const existingStartDate = new Date(existingClosure.startDate);
        const existingInitialClosureDate = new Date(
            existingClosure.initialClosureDate
        );
        const existingFinalClosureDate = new Date(
            existingClosure.finalClosureDate
        );
        const newStartDate = new Date(startDate);
        const newInitialClosureDate = new Date(initialClosureDate);
        const newFinalClosureDate = new Date(finalClosureDate);
        const maxStartDate = add(new Date(), { months: -1 });

        if (!isSameDay(existingStartDate, newStartDate)) {
            if (isBefore(newStartDate, maxStartDate)) {
                return res
                    .status(400)
                    .json(
                        'Start date must be within the last month and today or later'
                    );
            }
        }

        if (!isSameDay(existingInitialClosureDate, newInitialClosureDate)) {
            if (
                isBefore(newInitialClosureDate, startOfToday()) ||
                isAfter(newInitialClosureDate, add(new Date(), { years: 1 }))
            ) {
                return res
                    .status(400)
                    .json(
                        'Initial closure date must be today or later and within 1 year.'
                    );
            }
        }

        if (!isSameDay(existingFinalClosureDate, newFinalClosureDate)) {
            if (
                isBefore(newFinalClosureDate, startOfToday()) ||
                isAfter(newFinalClosureDate, add(new Date(), { years: 1 }))
            ) {
                return res
                    .status(400)
                    .json(
                        'Final closure date must be today or later and within 1 year.'
                    );
            }
        }

        if (isAfter(newInitialClosureDate, newFinalClosureDate)) {
            return res
                .status(400)
                .json(
                    'Initial closure date must be earlier or the same as final closure date'
                );
        }

        if (
            isAfter(newStartDate, newInitialClosureDate) ||
            isAfter(newStartDate, newFinalClosureDate)
        ) {
            return res
                .status(400)
                .json(
                    'Start date must be earlier than initial and final closure date'
                );
        }

        await Closure.findByIdAndUpdate(id, {
            $set: req.body,
        });
        return res.status(200).json('Category has been updated');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

// export const UpdateClosureDate = async (req, res) => {
//     const { id } = req.query;
//     const { initialClosureDate, finalClosureDate, startDate } = req.body;

//     try {
//         const existingClosure = await Closure.findById(id);

//         if (!existingClosure) {
//             return res.status(400).json('Closure Date Does Not Exist');
//         }

//         const today = new Date().toISOString().split('T')[0];
//         let oneMonthAgo = new Date();
//         oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//         oneMonthAgo = oneMonthAgo.toISOString().split('T')[0];

//         const start = new Date(startDate).toISOString().split('T')[0];
//         const existingStart = new Date(existingClosure.startDate)
//             .toISOString()
//             .split('T')[0];
//         const initial = new Date(initialClosureDate)
//             .toISOString()
//             .split('T')[0];
//         const existingInitial = new Date(existingClosure.initialClosureDate)
//             .toISOString()
//             .split('T')[0];
//         const final = new Date(finalClosureDate).toISOString().split('T')[0];
//         const existingFinal = new Date(existingClosure.finalClosureDate)
//             .toISOString()
//             .split('T')[0];

//         if (initial !== existingInitial) {
//             if (initial < today) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Initial Closure Date must be in the future.'
//                     );
//             }

//             if (initial > final) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Initial Closure Date must be before Final Closure Date.'
//                     );
//             }

//             if (initial < start) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Initial Closure Date must be after Start Date.'
//                     );
//             }
//         }

//         if (final !== existingFinal) {
//             if (final < today) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Final Closure Date must be in the future.'
//                     );
//             }

//             if (final < initial) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Final Closure Date must be after Initial Closure Date.'
//                     );
//             }

//             if (final < start) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Final Closure Date must be after Start Date.'
//                     );
//             }
//         }

//         if (start !== existingStart) {
//             if (start < oneMonthAgo) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Start Date must be within the last month.'
//                     );
//             }

//             if (start > initial) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Start Date must be before Initial Closure Date.'
//                     );
//             }

//             if (start > final) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Start Date must be before Final Closure Date.'
//                     );
//             }
//         }

//         await Closure.findByIdAndUpdate(id, {
//             $set: req.body,
//         });
//         return res.status(200).json('Category has been updated');
//     } catch (error) {
//         return res.status(500).json(`Internal Server Error: ${error}`);
//     }
// };

export const DeleteClosureDate = async (req, res) => {
    const { id } = req.query;

    try {
        const existingClosure = await Closure.findById(id);

        if (!existingClosure) {
            return res.status(400).json('Closure Date Does Not Exist');
        }

        await Closure.findByIdAndDelete(id);
        return res
            .status(200)
            .json('Closure dates has been deleted successfully');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};
