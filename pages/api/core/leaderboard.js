import Users from '../../../database/Users';

export default async function handler(req, res) {
  const users = await Users.findAll({
    attributes: ['discord_name', 'discord_tag', 'playtime', 'discord_profile_picture', 'quote'],
    order: [
      ['playtime', 'DESC']
    ],
    limit: 20
  });

  res.status(200).json(users);
}