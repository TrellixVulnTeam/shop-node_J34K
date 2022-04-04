const express = require('express')
const { route } = require('express/lib/router')
const router = express.Router()
const adminController = require('../controllers/AdminController')

//slider
router.get('/view-slider',adminController.viewSlider)
router.get('/add-slider', adminController.addSlider)
router.post('/add-slider', adminController.addSliderAction)
router.get('/edit-slider/:id', adminController.editSlider)
router.put('/edit-slider/:id', adminController.updateSlider)
router.delete('/delete-slider/:id', adminController.deleteSlider)

//cate
router.get('/view-cate',adminController.viewCate)
router.get('/add-cate', adminController.addCate)
router.post('/add-cate', adminController.addCateAction)
router.get('/edit-cate/:id', adminController.editCate)
router.delete('/delete-cate/:id', adminController.deleteCate)
router.put('/edit-cate/:id', adminController.updateCate)



// //product
router.get('/edit-pro/:id',adminController.editPro)
router.put('/edit-pro/:id', adminController.update)
router.delete('/delete/:id',adminController.deletePro)
router.get('/view-pro', adminController.viewPro)
router.get('/add-pro', adminController.addPro)
router.post('/add-pro', adminController.addProduct)


//site
// router.get('/login', adminController.loginView)
router.get('/',adminController.index)
// router.post('/',adminController.afterLogin)

module.exports = router
