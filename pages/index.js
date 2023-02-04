import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { ImExit } from 'react-icons/im';
import { IoPushOutline } from 'react-icons/io5';
import { AiFillGithub } from 'react-icons/ai';
import { Triangle } from 'react-loader-spinner';

export default function Dev() {
  const { data: session, status } = useSession();

  const loggedIn = status === 'authenticated';
  const [playtime, setPlaytime] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [steamLinked, setSteamLinked] = useState(false);
  const [steamLoading, setSteamLoading] = useState(true);
  const [top, setTop] = useState([]);
  const quoteRef = useRef(null);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.steamId) return;
    fetch(`/api/core/playtime?id=${session.user.steamId}`)
      .then(res => res.json())
      .then(data => {
        setPlaytime(data.playtime);
        setSteamLinked(true);
        setSteamLoading(false);
      })
  }, [session, status])

  useEffect(() => {
    fetch('/api/core/leaderboard')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => b.playtime - a.playtime);
        setTop([sorted[1], sorted[0], sorted[2]]);
        setLeaderboard(data);
        setLeaderboardLoading(false);
      })
  }, []);

  const setQuote = async () => {
    const quote = quoteRef.current.value;

    fetch(`/api/core/quote?quote=${quote}`)
      .then(res => res.json())
      .then(data => {
        alert(data.success ? 'Quote updated!' : 'Error updating quote!');
      });
  }

  return (
    <div className="bg-background h-screen w-screen flex flex-col overflow-x-hidden">
      <div className="flex flex-row pt-10">
        <div className="w-1/2 mx-auto">
          <div className="flex flex-row items-stretch text-primary-3 m-4 mb-8">
            {top.map((user, index) => (
              <div className={`flex flex-col items-center m-2 ${top.indexOf(user) === 1 ? 'w-1/2' : 'w-1/4'}`}
                   key={index}>
                <h1>{user.discord_name}#{user.discord_tag}</h1>
                <p>{Math.floor(user.playtime / 60)} Hours</p>
                <img src={user.discord_profile_picture} alt="Profile Picture"
                     className={`rounded-full border-4 m-2 my-2" ${['border-silver-500', 'border-yellow-500', 'border-yellow-900'][top.indexOf(user)]}`}/>
                <p className="italic text-center text-primary-3">{user?.quote}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full bg-primary-1 rounded-md">
            {!leaderboardLoading ? (
              leaderboard.map((user, index) => (
                <div className="text-primary-3 w-full p-2 flex flex-row" key={index}>
                  <p
                    className={`px-2 ${leaderboard.indexOf(user) <= 2 && 'border-[1px]'} ${['border-yellow-500', 'border-silver-500', 'border-yellow-900']?.[leaderboard.indexOf(user)]} rounded-md mr-2`}>{leaderboard.indexOf(user) + 1}</p>
                  <p>{user.discord_name}#{user.discord_tag}</p>
                  <p className="ml-auto mr-2">{Math.floor(user.playtime / 60)} Hours</p>
                </div>
              ))
            ) : (
              <div className="flex flex-row justify-center items-center w-full h-full">
                <Triangle type="ThreeDots" height={80} width={80}/>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-1/4 mx-auto justify-center border-red-500">
          <div className="flex flex-col w-full">
            {loggedIn ?
              steamLinked ? (
                <div className="flex flex-col">
                  <h1 className="self-center pt-2 text-3xl text-primary-3">{session.user.name}#{session.user.tag}</h1>
                  <p className="self-center text-primary-3 mt-1">Playtime: {Math.floor(playtime / 60)} hours</p>
                  <textarea className="outline-0 rounded-md p-2 m-2 bg-gray-300" ref={quoteRef}
                            maxLength="32"></textarea>
                  <button
                    className="bg-primary-1 text-primary-3 rounded-md p-2 flex flex-row space-x-2 justify-center mt-2">
                    <IoPushOutline className="h-full"/>
                    <p className="h-full" onClick={setQuote}>Update Quote</p>
                  </button>
                  <button
                    className="bg-primary-1 text-primary-3 rounded-md p-2 flex flex-row space-x-2 justify-center mt-2"
                    onClick={() => signOut()}><ImExit className="h-full"/>
                    <p className="h-full">Sign Out</p>
                  </button>
                  {playtime === 0 && (
                    <div className="flex flex-col">
                      <p className="self-center pt-2 text-xl text-primary-3 text-center">No hours? Make sure you have
                        your &quot;Game details&quot; set to &quot;Public&quot; and check the box under the setting in
                        your
                        <a target="_blank"
                           href={`https://steamcommunity.com/id/${session.user.steamName}/edit/settings`}
                           rel="noreferrer" className="text-blue-500"> steam privacy settings</a>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {steamLoading || true ? (
                    <div className="flex flex-row justify-center">
                      <Triangle/>
                    </div>
                  ) : (
                    <div>
                      <h1 className="self-center pt-2 text-3xl text-primary-3 text-center">You must link your steam
                        account
                        to your discord account to continue!</h1>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col">
                  <button className="bg-gray-700 text-primary-3 rounded-md p-2 flex flex-row space-x-2 justify-center"
                          onClick={() => signIn('discord')}><FaDiscord className="h-full"/>
                    <p className="h-full">Sign In</p>
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center mt-auto">
        <div className="flex flex-col text-primary-3 text-center m-4">
          <p>Made by <a href="https://github.com/oneandonlyfinbar" target="_blank" className="text-blue-500">Finbar</a>
          </p>
          <a href="https://github.com/OneAndonlyFinbar/dbm-leaderboard" className="mx-auto mt-1" rel="noreferrer"
             target="_blank"><AiFillGithub/></a>
        </div>
      </div>
    </div>
  );
}