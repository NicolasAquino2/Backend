const UsersService = require('../services/UsersServices')

class UsersController {
    constructor() {
        this.service = new UsersService();
    }

}

module.exports = UsersController;