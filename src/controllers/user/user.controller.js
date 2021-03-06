import UserModel from '../../models/user/user.model';

export default class UserController {

    /** create a new user */
    static createUser(req, res) {
        if (!req.body) {
            return res.status(400).send({
                message: 'Note content can not be empty'
            });
        };

        const user = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        user.save()
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                res.status(500).send({
                    message: error.message || 'Some error ocured while creating the user.'
                })
            })
    }

    /** return all the users in the database */
    static findAllUsers(req, res) {
        UserModel.find()
            .then((result) => {
                const users = result.map((user) => {
                    return { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
                })
                res.status(200).send(users);
            })
            .catch((res) => {
                res.status(500).send({
                    message: error.message || 'Some error ocurred while retrieving users.'
                });
            });
    };

    /** find a single note with a userId */
    static findOneUser(req, res) {
        UserModel.findById(req.params.userId, { password: 0 })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({
                        message: `User not found with id ${req.params.userId}`
                    });
                }
                res.status(200).send(user);
            })
            .catch((error) => {
                if (error.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: `User not found with id ${req.params.userId}`
                    })
                }

                return res.status(500).send({
                    message: `Error retrieving note with id ${req.params.userId}`
                });
            });
    };

    /** Update a user identified by the userId in the request */
    static updateUser(req, res) {
        if (!req.body.content) {
            return res.status(400).send({
                message: 'User content can not be empty'
            });
        };

        UserModel.findByIdAndUpdate(req.params.userId, {

            name: req.body.name,
            email: req.body.email,
            password: req.body.password

        }, { new: true })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({
                        message: `User not found with id ${req.params.userId}`
                    });
                }
                res.status(200).send(note);
            })
            .catch((error) => {
                if (error.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: `User not found with id ${req.params.userId}`
                    });
                }

                return res.status(500).send({
                    message: `User not found with id ${req.params.userId}`
                });
            });
    };

    /** Delete a user with the specified userId in the request */
    static deleteUser(req, res) {
        NoteModel.findByIdAndRemove(req.params.userId)
            .then((note) => {
                if (!note) {
                    return res.status(404).send({
                        message: `User not found with id ${req.params.userId}`
                    });
                }
                res.status(200).send({
                    message: 'User deleted successfully.'
                });
            })
            .catch((error) => {
                if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                    return res.status(404).send({
                        message: `User not found with id ${req.params.userId}`
                    });
                }
                return res.status(500).send({
                    message: `Could not delete user with id ${req.params.userId}`
                })
            })
    };

}