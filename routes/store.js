let express = require('express');
let router = express.Router();

// Require controller modules.
let produce_type_controller = require('../controllers/produceTypeController');
let item_controller = require('../controllers/itemController');
/// item ROUTES ///

// GET store home page.
router.get('/', item_controller.index);

// GET request for creating a item. NOTE This must come before routes that display item (uses id).
router.get('/item/create', item_controller.item_create_get);

// POST request for creating item.
router.post('/item/create', item_controller.item_create_post);

// GET request to delete item.
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request to delete item.
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request to update item.
router.get('/item/:id/update', item_controller.item_update_get);

// POST request to update item.
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one item.
router.get('/item/:id', item_controller.item_detail);

// GET request for list of all item items.
router.get('/items', item_controller.item_list);


/// producetype ROUTES ///

// GET request for creating a producetype. NOTE This must come before route that displays producetype (uses id).
router.get('/producetype/create', produce_type_controller.producetype_create_get);

//POST request for creating producetype.
router.post('/producetype/create', produce_type_controller.producetype_create_post);

// GET request to delete producetype.
router.get('/producetype/:id/delete', produce_type_controller.producetype_delete_get);

// POST request to delete producetype.
router.post('/producetype/:id/delete', produce_type_controller.producetype_delete_post);

// GET request to update producetype.
router.get('/producetype/:id/update', produce_type_controller.producetype_update_get);

// POST request to update producetype.
router.post('/producetype/:id/update', produce_type_controller.producetype_update_post);

// GET request for one producetype.
router.get('/producetype/:id', produce_type_controller.producetype_detail);

// GET request for list of all producetype.
router.get('/producetypes', produce_type_controller.producetype_list);

module.exports = router;