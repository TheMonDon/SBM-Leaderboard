import Users from '../../../database/Users';
import { getSession } from 'next-auth/react';

export default async function router(req, res) {
  const discordSession = await getSession({ req });

  if(!discordSession) {
    res.status(401).json({error: 'Unauthorized'})
  }

  const { quote } = req.query;

  await Users.update({
    quote
  }, {
    where: {
      discord_id: discordSession.user.id
    }
  });

  res.status(200).json({success: true})
}