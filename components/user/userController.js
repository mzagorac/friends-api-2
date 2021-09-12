const { User } = require('../../models');
exports.getUsers = async (req, res, next) => {
  const { id } = req.params;
  const { friends, friendsOfMyFriends, suggestedFriends } = req.query;
  console.log(friends);

  const filter = { friends: { $in: id } };
  // const fofFilter = {  }

  // const usrs = await User.aggregate([
  //   { $match: { friends: { $in: [Number(id)] } } },
  //   { $project: { friends: 1, _id: 0 } },
  // ]);
  // console.log(usrs);

  ////////////////////////////////////////////////////////////
  /*
  let usrs = await (
    await User.find({ friends: { $in: id } }).select('friends -_id')
  )
    .flatMap((u) => u.friends)
    .filter((u) => Number(u) !== Number(id))
    .sort((a, b) => a - b);

  usrs = Array.from(new Set(usrs));
  console.log(usrs);

  const fofFilter = { friends: { $in: [usrs], $not: { $in: [Number(id)] } } };
  const fofs = await User.find(fofFilter).lean();

  // console.log(fofs);

  //////////////////////////////////////////////////////////////////////
  */

  let [users, count] = await Promise.all([User.find(filter).lean(), User.find(filter).count()]);

  if (friendsOfMyFriends) {
    const usrsIds = users
      .flatMap((u) => u.friends)
      .filter((u) => Number(u) !== Number(id))
      .sort((a, b) => a - b);

    const uIds = Array.from(new Set(usrsIds));
    console.log(uIds);

    const [friendsOfFriends, c] = await Promise.all([
      User.find({ id: { $in: uIds } }).lean(),
      User.find({ id: { $in: uIds } }).count(),
    ]);

    console.log(friendsOfFriends);
    users = friendsOfFriends;
    count = c;
  }

  // const fof = await User.find({ 'friends': { $in: users } });
  // console.log(fof);

  res.send({ message: 'Success fetching users', count, data: users });
};
