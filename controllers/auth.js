const auth = require('../services/auth');
const basicauth = require('basic-auth');

const login = (req, res) => {
  // map name to email
  const { name:email, pass } = basicauth(req);
  const { lineId } = req.params;
  return auth.login(email, pass, lineId)
  .then(result => res.status(200).json({
    success: result
  }))
  .catch(err => {
    console.error(err);
    console.log(err.message);
    res.status(400).send({message: err.message});
  })
}

const checkLogin = (req, res) => {
  const { lineId } = req.params;
  return auth.checkLogin(lineId)
  .then(result => res.status(200).json({
    isLoggedIn: result
  }))
  .catch(err => {
    console.log(errmsg);
    res.status(500).send(errmsg);
  });
}

const logout = (req, res) => {
  const { lineId } = req.params;
  return auth.logout(lineId)
  .then(result => res.status(200).json({
    success: result
  }))
  .catch(err => {
    console.error(err);
    res.status(500)
    res.send({ msg: err});
  })
}

module.exports = {
  login,
  checkLogin,
  logout
}