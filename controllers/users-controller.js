import bcrypt from 'bcrypt';
import User from 'models/User';
import restrictedNames from '@/utils/restrictedNames';
export const FindUser = async (req, res) => {
    const { id } = req.query;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json('User not found');
        }
        /* This is a destructuring assignment. It is used to extract data from objects and arrays. */
        const { password, updatedAt, ...other } = user._doc;

        return res.status(200).json(other);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const FindAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -updatedAt');

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const UserLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        !user && res.status(404).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);

        !validPassword && res.status(400).json('Incorrect Login Details');

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const UserRegister = async (req, res) => {
    const { name, email, password, role, dateOfBirth, department } = req.body;
    let userPassword = password;
    let userRole = role;

    if (!userPassword) {
        userPassword = 'Uni1234';
    }
    if (!userRole) {
        userRole = 'staff';
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json('Email already in use');
        }

        switch (restrictedNames.includes(name)) {
            case true:
                return res.status(400).json('Name not allowed');
            default:
                break;
        }

        /* Generating a salt and then hashing the password. */
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        /* Creating a new user object. */
        const newUser = new User({
            name: name,
            email: email,
            role: userRole,
            password: hashedPassword,
            dateOfBirth: dateOfBirth,
            department: department,
        });

        /* Saving the new user to the database and 
        then sending a response back to the client. */
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};

export const UserRegisterMulti = async (req, res) => {
    try {
        const savedUsers = [];

        for (let i = 0; i < req.body.length; i++) {
            const user = req.body[i];
            const newUser = new User({
                name: user.name,
                email: user.email,
                password: await bcrypt.hash(user.password, 12),
                role: user.role,
                dateOfBirth: user.dateOfBirth,
                department: user.department,
            });
            const savedUser = await newUser.save();
            savedUsers.push(savedUser);
        }

        return res.status(200).json(savedUsers);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const UpdateUser = async (req, res) => {
    const { userId, password, name, dateOfBirth } = req.body;
    const { id } = req.query;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json('User not found');
        }

        const currentUser = await User.findById(userId);

        if (userId !== id && currentUser.role !== 'admin') {
            return res.status(403).json(`You can only update your account!`);
        }

        switch (restrictedNames.includes(name)) {
            case true:
                return res.status(400).json('Name not allowed');
            default:
                break;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);

            await User.findByIdAndUpdate(id, {
                $set: req.body,
            });
        } else {
            const { password, ...rest } = req.body;
            await User.findByIdAndUpdate(id, {
                $set: rest,
            });
        }

        return res.status(200).json('Account has been updated');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const DeleteUser = async (req, res) => {
    const { id } = req.query;

    // if (userId !== _id) {
    //     return res.status(403).json('You can only delete your account!');
    // }

    try {
        const user = await User.findByIdAndDelete(id);
        return res.status(200).json('Account has been deleted successfully');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const DeleteMultipleUsers = async (req, res) => {
    const ids = req.body;

    try {
        await User.deleteMany({ _id: { $in: ids } });

        return res.status(200).json('Users have been deleted successfully');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};
