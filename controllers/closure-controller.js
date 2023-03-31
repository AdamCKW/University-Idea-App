import Closure from 'models/Closure';

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
            return res.status(400).json('Closure Date Already Exists');
        }

        const today = new Date().toISOString().split('T')[0];
        const start = new Date(startDate).toISOString().split('T')[0];
        const initial = new Date(initialClosureDate)
            .toISOString()
            .split('T')[0];
        const final = new Date(finalClosureDate).toISOString().split('T')[0];
        let oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo = oneMonthAgo.toISOString().split('T')[0];

        /* This is checking if the initial or final closure date is in the past. If it is, it will
        return an error. */
        if (initial < today || final < today) {
            return res
                .status(400)
                .json(
                    'Invalid Date, Initial or Final Closure Date must be in the future.'
                );
        }

        /* This is checking if the start date is more than a month ago. If it is, it will return an
        error. */
        if (start < oneMonthAgo) {
            return res
                .status(400)
                .json(
                    'Invalid Date, Start Date must be within the last month.'
                );
        }

        /* This is checking if the initial closure date is after the final closure date. If it is, it
        will return an error. */
        if (initial > final) {
            return res
                .status(400)
                .json(
                    'Invalid Date, Initial Closure Date must be before Final Closure Date.'
                );
        }

        /* This is checking if the start date is after the initial or final closure date. If it is, it
        will return an error. */
        if (start > initial || start > final) {
            return res
                .status(400)
                .json(
                    'Invalid Date, Start Date must be before Initial or Final Closure Date.'
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
        return res.status(500).json('Internal Server Error');
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

        const today = new Date().toISOString().split('T')[0];
        let oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo = oneMonthAgo.toISOString().split('T')[0];

        const start = new Date(startDate).toISOString().split('T')[0];
        const existingStart = new Date(existingClosure.startDate)
            .toISOString()
            .split('T')[0];
        const initial = new Date(initialClosureDate)
            .toISOString()
            .split('T')[0];
        const existingInitial = new Date(existingClosure.initialClosureDate)
            .toISOString()
            .split('T')[0];
        const final = new Date(finalClosureDate).toISOString().split('T')[0];
        const existingFinal = new Date(existingClosure.finalClosureDate)
            .toISOString()
            .split('T')[0];

        if (initial !== existingInitial) {
            if (initial < today) {
                return res
                    .status(400)
                    .json(
                        'Invalid Date, Initial Closure Date must be in the future.'
                    );
            }

            if (initial > final) {
                return res
                    .status(400)
                    .json(
                        'Invalid Date, Initial Closure Date must be before Final Closure Date.'
                    );
            }

            if (initial < start) {
                return res
                    .status(400)
                    .json(
                        'Invalid Date, Initial Closure Date must be after Start Date.'
                    );
            }
        }

        if (final !== existingFinal) {
            if (final < today) {
                return res
                    .status(400)
                    .json(
                        'Invalid Date, Final Closure Date must be in the future.'
                    );
            }

            if (final < initial) {
                return res
                    .status(400)
                    .json(
                        'Invalid Date, Final Closure Date must be after Initial Closure Date.'
                    );
            }

            if (final < start) {
                return res
                    .status(400)
                    .json(
                        'Invalid Date, Final Closure Date must be after Start Date.'
                    );
            }
        }

        if (start !== existingStart) {
            if (start < oneMonthAgo) {
                return res
                    .status(400)
                    .json(
                        'Invalid Date, Start Date must be within the last month.'
                    );
            }

            if (start > initial) {
                return res
                    .status(400)
                    .json(
                        'Invalid Date, Start Date must be before Initial Closure Date.'
                    );
            }

            if (start > final) {
                return res
                    .status(400)
                    .json(
                        'Invalid Date, Start Date must be before Final Closure Date.'
                    );
            }
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

//         const today = new Date().toISOString();
//         const start = new Date(startDate).toISOString();
//         const existingStart = new Date(existingClosure.startDate).toISOString();
//         const initial = new Date(initialClosureDate).toISOString();
//         const existingInitial = new Date(
//             existingClosure.initialClosureDate
//         ).toISOString();
//         const final = new Date(finalClosureDate).toISOString();
//         const existingFinal = new Date(
//             existingClosure.finalClosureDate
//         ).toISOString();

//         if (initial !== existingInitial || final !== existingFinal) {
//             const today2 = new Date();
//             const initial2 = new Date(initialClosureDate);
//             const final2 = new Date(finalClosureDate);

//             if (initial2 < today2 || final2 < today2) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Initial or Final Closure Date must be in the future.'
//                     );
//             }

//             if (initial2 > final2) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Initial Closure Date must be before Final Closure Date.'
//                     );
//             }

//             if (start > initial || start > final) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Start Date must be before Initial or Final Closure Date.'
//                     );
//             }
//         }

//         if (start !== existingStart) {
//             const startDate2 = new Date(startDate);
//             const oneMonthAgo = new Date();
//             oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//             if (startDate2 < oneMonthAgo) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Start Date must be within the last month.'
//                     );
//             }

//             if (start > initial || start > final) {
//                 return res
//                     .status(400)
//                     .json(
//                         'Invalid Date, Start Date must be before Initial or Final Closure Date.'
//                     );
//             }
//         }

//         await Closure.findByIdAndUpdate(id, {
//             $set: req.body,
//         });
//         return res.status(200).json('Category has been updated');
//     } catch (error) {
//         return res.status(500).json('Internal Server Error');
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
