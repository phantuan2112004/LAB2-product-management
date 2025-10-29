const checkLoginSession = (req, res, next) => {
  if (req.session.username) {
    next(); 
  } else {
    res.redirect('/auth/login'); 
  }
};

const checkAdminSession = (req, res, next) => {
  if (req.session.username && req.session.role === 'admin') {
    next();
  } else {
    res.redirect('/auth/login'); 
  }
};

module.exports = {
    checkLoginSession,
    checkAdminSession 
};