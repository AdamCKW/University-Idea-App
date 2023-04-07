import Category from 'models/Category';
import Post from 'models/Post';

/**
 * It finds a category by its id and returns it to the user.
 * @param req - request
 * @param res - The response object.
 * @returns The category object.
 */
export const FindCategory = async (req, res) => {
    const { id } = req.query;

    try {
        const category = await Category.findById(id);
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

/**
 * It's a function that finds all the categories in the database and returns them in a JSON format.
 * @param req - The request object.
 * @param res - The response object.
 * @returns An array of categories
 */
export const FindAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

/**
 * It takes a name from the request body, creates a new category, checks if the category
 * already exists, and if it doesn't, it saves the category and returns it.
 * @param req - request
 * @param res - {
 * @returns The category is being returned.
 */
export const AddCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const newCategory = new Category({ name: name });

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json(`Category Name Already Exists`);
        }

        const category = await newCategory.save();

        return res.status(201).json(category);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

/**
 * It updates a category in the database
 * @param req - request
 * @param res - response
 * @returns The category has been updated
 */
export const UpdateCategory = async (req, res) => {
    const { id } = req.query;
    const { name } = req.body;

    try {
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json(`Category Name Already Exists`);
        }

        await Category.findByIdAndUpdate(id, {
            $set: req.body,
        });
        return res.status(200).json('Category has been updated');
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};

/**
 * It deletes a category from the database if it's not in use.
 * </code>
 * @param req - request
 * @param res - response
 * @returns The category is being returned.
 */
export const DeleteCategory = async (req, res) => {
    const { id } = req.query;
    const category = id;

    try {
        const categoryInUse = await Post.findOne({ category });
        if (categoryInUse) {
            return res.status(400).json('Category In Use');
        }
        await Category.findByIdAndDelete(id);
        return res.status(200).json('Category has been deleted successfully');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

/**
 * It deletes multiple categories from the database
 * @param req - The request object.
 * @param res - The response object.
 * @returns The response is being returned as a string.
 */
export const DeleteMultipleCategory = async (req, res) => {
    const ids = req.body;

    try {
        const categoriesInUse = await Post.find({ category: { $in: ids } });
        if (categoriesInUse.length > 0) {
            return res.status(400).json('Categories in use');
        }
        await Category.deleteMany({ _id: { $in: ids } });
        return res
            .status(200)
            .json('Categories have been deleted successfully');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};
