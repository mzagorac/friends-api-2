const { User } = require('../../models');
const { keepDuplicates, removeDuplicates } = require('../../lib/keepOrRemoveDuplicates');
const { BAD_REQUEST, NOT_FOUND } = require('../../middlewares/error-handling/errorConstants');

exports.getUsers = async (req, res, next) => {
  const { id } = req.params;
  const { friendsOfMyFriends, suggestedFriends } = req.query;

  if (friendsOfMyFriends && suggestedFriends) throw new Error(BAD_REQUEST);

  let filter = { friends: { $in: id } };

  let [users, count] = await Promise.all([User.find(filter).lean(), User.find(filter).count()]);

  if (!users) throw new Error(NOT_FOUND);

  if (friendsOfMyFriends || suggestedFriends) {
    const usrsIds = users
      .flatMap((u) => u.friends)
      .filter((u) => Number(u) !== Number(id))
      .sort((a, b) => a - b);

    const uIds = friendsOfMyFriends ? removeDuplicates(usrsIds) : keepDuplicates(usrsIds);
    filter = { id: { $in: uIds }, friends: { $not: { $in: [Number(id)] } } };

    const [friendsOfFriends, c] = await Promise.all([User.find(filter).lean(), User.find(filter).count()]);

    users = friendsOfFriends;
    count = c;
  }

  res.send({ message: 'Success fetching users', count, data: users });
};
