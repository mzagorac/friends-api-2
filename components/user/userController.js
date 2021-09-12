const { User } = require('../../models');
const { keepDuplicates, removeDuplicates } = require('../../lib/keepOrRemoveDuplicates');

exports.getUsers = async (req, res, next) => {
  const { id } = req.params;
  const { friendsOfMyFriends, suggestedFriends } = req.query;

  const filter = { friends: { $in: id } };
  let [users, count] = await Promise.all([User.find(filter).lean(), User.find(filter).count()]);

  if (friendsOfMyFriends || suggestedFriends) {
    const usrsIds = users
      .flatMap((u) => u.friends)
      .filter((u) => Number(u) !== Number(id))
      .sort((a, b) => a - b);

    let uIds;

    if (friendsOfMyFriends) uIds = removeDuplicates(usrsIds);
    if (suggestedFriends) uIds = keepDuplicates(usrsIds);

    const [friendsOfFriends, c] = await Promise.all([
      User.find({ id: { $in: uIds }, friends: { $not: { $in: [Number(id)] } } }).lean(),
      User.find({ id: { $in: uIds }, friends: { $not: { $in: [Number(id)] } } }).count(),
    ]);

    users = friendsOfFriends;
    count = c;
  }

  res.send({ message: 'Success fetching users', count, data: users });
};
