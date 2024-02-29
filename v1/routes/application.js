const router = require("express").Router();
const controllers = require('../controllers');
const services = require('../services')

router.post("/", services.upload.upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'docs', maxCount: 2 },
]), services.upload.setFilename, controllers.application.create);
router.get("/", controllers.application.get)
router.get("/:id", controllers.application.getById)
router.put("/:id", services.upload.upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'docs', maxCount: 2 },
]), services.upload.setFilename, controllers.application.updateById)
router.delete("/:id", controllers.application.deleteById)
module.exports = router;