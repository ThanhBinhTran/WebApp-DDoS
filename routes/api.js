exports.name = function (req, res) {
  console.log('controller: name')
  res.json({
    name: 'Dashboard'
  });
};
