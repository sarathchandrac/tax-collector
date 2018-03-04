var express = require("express"),
    db = require('../models'),
    helper = require('../helpers/todos'),
    router = express.Router();

//router.get('/', helper.getTodos);
router.route('/')
    .get(helper.getTodos)
    .post(helper.createTodo);

router.route('/:todoId')
    .get(helper.getTodo)
    .put(helper.updateTodo)
    .delete(helper.deleteTodo);
    

//router.post('/',);

//router.get('/:todoId', 

//router.put('/:todoId', )

//router.delete('/:todoId',)



module.exports = router;