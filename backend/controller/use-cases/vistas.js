
exports.registrar = (req, res) => {
    try {
        res.render('registrar');
        
    } catch (error) {
        console.log(error)
    }
  };