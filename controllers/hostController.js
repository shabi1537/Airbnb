const Home = require("../models/home")


exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn : req.isLoggedIn,
    user: req.session.user,
  })
}

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, photoUrl} = req.body
  const home = new Home({houseName, price, location, rating, photoUrl})
  home.save()
  .then(() => {
    console.log('Home Saved successfully')
  })
  .catch(err => console.log('Error while adding house'))
  
  res.render('host/home-added', {
  pageTitle: 'Home Added',
  currentPage: 'addHome',
  isLoggedIn: req.isLoggedIn,
  user: req.session.user,  // optional, if your nav bar depends on it
});
}

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId
  const editing = req.query.editing === 'true'

  Home.findById(homeId)
  .then(home => {
    if (!home) {
      console.log("Home not found for editing.")
      return res.redirect("/host/host-home-list")
    }

    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn : req.isLoggedIn,
      user: req.session.user,
    })
  })
}

exports.getHostHomes = (req, res, next) => {
  Home.find()
  .then(registeredHomes => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn : req.isLoggedIn,
      user: req.session.user,
    })
  })
  .catch(err => console.log('No homes are added by host...', err))
}


exports.postEditHome = (req, res, next) => {
  const { _id, houseName, price, location, rating, photoUrl } = req.body

  Home.findById(_id)
  .then(home => {
    home.houseName = houseName
    home.price = price
    home.location = location
    home.rating = rating
    home.photoUrl = photoUrl

    home.save()
    .then( ()=> console.log('Home Edited successfully...'))
    .catch(err => console.log('This home cant be edited', err))

    res.redirect("/host/host-home-list")
  })
  .catch(err => console.log('Error while finding home', err))


  res.redirect("/host/host-home-list")
    
}


exports.postDeleteHome = (req, res, next) => {

  const homeId = req.params.homeId

  Home.findByIdAndDelete(homeId)
  .then(() => {
    console.log('Home Removed...')
    res.redirect("/host/host-home-list") 
    } )
  .catch(error => {
      console.log('Error while deleting...', error)
      res.redirect("/host/host-home-list")
  })
}