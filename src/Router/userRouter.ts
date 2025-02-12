import router from "./sessionRouter";
import {deleteUser, findAllUsers, findUser, updateUser} from "../Controller/userController";

router.route('/')
    .get(findAllUsers);


router.route('/:id')
    .get(findUser)
    .patch(updateUser)
    .delete(deleteUser);

router.route('/register');

router.route('login');

export default router;