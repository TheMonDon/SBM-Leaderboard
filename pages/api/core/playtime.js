import axios from 'axios';
import Users from '../../../database/Users';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { STEAM_API_KEY } = process.env;
  const { id } = req.query;
  const discordSession = await getSession({ req });

  await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${id}&format=json&include_appinfo=1`)
    .then(async response => {
      const DBM = response.data.response.games.find(game => game.appid === 682130);
      const { playtime_forever } = DBM;
      await Users.update({
        playtime: playtime_forever,
        steam_id: id,
        last_updated: new Date().toISOString()
      }, {
        where: {
          discord_id: discordSession.user.id
        }
      })
      res.status(200).json({playtime: playtime_forever})
    })
    .catch(err => {
      res.status(500).json({error: err})
    });
}