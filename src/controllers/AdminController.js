const Product = require('../models/Product')
const Cate = require('../models/Cate')
const Slider = require('../models/Slider')
class AdminController{
    //product
    addPro(req,res){
        // const pro  = new product(req.body)
        // console.log(pro);
        Cate.find({})
            .then(cates =>{
                cates = cates.map(item => item.toObject())
                res.render('admin/add-pro',{
                    layout: "admin-layout.hbs",
                    cates
                })
            })
       
    }
    async addProduct(req,res){
        try {
            res.render('admin/add-pro',{
                layout: "admin-layout.hbs"
            })
            // const newName = req.body.name.toUpperCase()
            const pro = new Product({
                
                name: req.body.name.toUpperCase(),
                image: req.body.image,
                image2: req.body.image2,
                price: req.body.price,
                hot: req.body.hot,
                desc: req.body.desc,
                number: req.body.number,
                cate: req.body.cate,
            })
            // res.send(pro)
            const savePro = await pro.save()
            if(req.body.cate){
                const cate = Cate.findById(req.body.cate)
                await cate.updateOne({$push: {products: savePro._id}})
            }
            res.status(200).json(savePro)
        } catch (err) {
            console.log(err);
        }
       
    }
    viewPro(req,res){
        Product.find({})
            .then(products => {
                products = products.map(item => item.toObject())
                res.render('admin/view-pro.hbs',{
                    products,
                    layout: 'admin-layout.hbs'
                })
            })
    }
    deletePro(req,res){
        Product.deleteOne({id: req.params})
            .then(() => res.redirect('/admin/view-pro'))
            .catch(err => console.log(err))
    }
    editPro(req,res){
        Product.findById(req.params.id)
            .then(product =>{
                res.render('admin/edit-product' , { product: product.toObject(), layout:'admin-layout.hbs'})
            })
            .catch(err =>console.log(err))
    }
    update(req,res){
        // console.log(req.body)
        Product.updateOne({_id: req.params.id},req.body)
            .then(() => res.redirect('/admin/view-pro'))
            .catch(err => console.log(err))
    }
    //cate
    addCate(req,res){
        res.render('admin/add-cate',{
            layout: "admin-layout.hbs"
        })
    }
    addCateAction(req,res){
        const cate = new Cate(req.body)
        cate.save()
            .then(() => res.redirect('back'))
            .catch(err => console.log(err))
    }
    viewCate(req,res){
        Cate.find({})
            .then(cates => {
                cates = cates.map(item => item.toObject())
                res.render('admin/view-cate.hbs', {
                    cates,
                    layout: 'admin-layout.hbs'
                })
            })
    }
    editCate(req,res){
        Cate.findById(req.params.id)
            .then(cates => {
                cates = cates.toObject()
                res.render('admin/edit-cate.hbs' ,{
                    cates,
                    layout: 'admin-layout.hbs'
                })
                // console.log(cates)
            })
    }
    updateCate(req,res){
        Cate.updateOne({_id: req.params.id}, req.body)
            .then(() => res.redirect('/admin/view-cate'))
            .catch(err => console.log(err))
    }
    deleteCate(req,res){
        Cate.deleteOne({id: req.params.id})
            .then(() => res.redirect('/admin/view-cate'))
            .catch(err => console.log(err))
    }
    //Slider
    viewSlider(req,res){
        Slider.find({})
            .then(slider =>{
                slider = slider.map(item => item.toObject())
                res.render('admin/view-slider.hbs',{
                    slider,
                    layout: 'admin-layout.hbs'
                })
            })
    }
    addSlider(req,res){
        res.render('admin/add-slider.hbs',{layout: 'admin-layout.hbs'})
    }
    addSliderAction(req,res){
        const slider = new Slider(req.body)
        slider.save()
            .then(() => res.redirect('back'))
            .catch(err => console.log(err))
    }
    editSlider(req,res){
        Slider.findById(req.params.id)
            .then(slider => {
                res.render('admin/edit-slider.hbs',{
                    layout: 'admin-layout.hbs',
                    slider : slider.toObject()
                })
            })
            .catch(err => console.log(err))
    }
    updateSlider(req,res){
        Slider.updateOne({id: req.params.id}, req.body)
            .then(() => res.redirect('/admin/view-slider'))
            .catch(err => console.log(err))
    }
    deleteSlider(req,res){
        Slider.deleteOne({id: req.params.id})
            .then(()=> res.redirect('/admin/view-slider'))
            .catch(err => console.log(err))
    }
    //site

    index(req,res){
        res.render('admin-login.hbs', {layout: 'admin-layout.hbs'})
    }
}

module.exports = new AdminController