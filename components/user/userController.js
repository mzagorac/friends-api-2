const { User } = require('../../models');

exports.getUsers = async (req, res, next) => {
  const { id } = req.params;

  const filter = { friends: { $in: id } };

  const [users, count] = await Promise.all([User.find(filter).lean(), User.find(filter).count()]);

  res.send({ message: 'Success fetching users', count, data: users });
};
