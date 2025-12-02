import UserModel from '../models/user.js';
import generateToken from '../utils/jwt.js';

// Create CRUD operations for User

// Get All Users = Same as db.users.find()
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}

// Read a user by ID = Same as db.users.findOne({_id: ObjectId("id")})
export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // 404 HTTP status code for not found
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}

// Create a new user = Same as db.users.insertOne()
export const createUser = async (req, res) => {
    try {
        const newUser = new UserModel(req.body);
        const savedUser = await newUser.save();

        const token = generateToken(savedUser);


        res.status(201).json({message: "User registered successfuly", user:savedUser, token}); // 201 HTTP status code for created
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}

// Update a user by ID = Same as db.users.updateOne({_id: ObjectId("id")}, {$set: {...}})
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,req.body, {
            new: true
        });

        if (!updatedUser){
            return res.status(404).json({ message: 'User not found' }); // 404 HTTP status code for not found
        }

        res.status(200).json(updatedUser);
    } catch (error) {
       res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}

// Delete a user by ID = Same as db.users.deleteOne({_id: ObjectId("id")})
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

        if (!deletedUser){
            return res.status(404).json({ message: 'User not found' }); // 404 HTTP status code for not found
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}

// Login user
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body; // descructuring from body
        const user = await UserModel.findOne({email})

        if (!user){
            return res.status(404).json({ message: 'User not found' }); // 404 HTTP status code for not found
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid){
            return res.status(401).json({ message: 'Invalid password' }); // 401 HTTP status code for unauthorized
        }

        const token = generateToken(user)

        return res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}