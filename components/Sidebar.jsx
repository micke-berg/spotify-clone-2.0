import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import { playlistIdState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import { HeartIcon, HomeIcon } from '@heroicons/react/solid';
import {
	SearchIcon,
	LibraryIcon,
	PlusIcon,
	RssIcon,
} from '@heroicons/react/outline';

const Sidebar = () => {
	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();
	const [playlists, setPlaylists] = useState([]);
	const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
	const playlist = useRecoilValue(playlistState);

	useEffect(() => {
		if (spotifyApi.getAccessToken()) {
			spotifyApi.getUserPlaylists().then((data) => {
				setPlaylists(data.body.items);
			});
		}
	}, [session, spotifyApi]);

	console.log('playlist', playlist);

	return (
		<div className="truncate flex-col text-neutral-400 bg-black h-screen w-72  text-sm border-r border-gray-900 hidden md:inline-flex">
			<nav className="p-5 pb-0 shadow-2xl shadow-black">
				<ul className="space-y-4">
					<img
						className="w-32 h-auto mb-8"
						src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
						alt="spotify"
					/>
					<li>
						<button className="list-item-button">
							<HomeIcon className="w-7 h-7" />
							<p>Home</p>
						</button>
					</li>
					<li>
						<button className="list-item-button">
							<SearchIcon className="w-7 h-7" />
							<p>Search</p>
						</button>
					</li>
					<li>
						<button className="list-item-button">
							<LibraryIcon className="w-7 h-7" />
							<p>Your Library</p>
						</button>
					</li>
					<div className="h-1 w-100" />
					<li>
						<button className="list-item-button hover:brightness-150">
							<span className="flex align-middle p-[4px] text-center bg-neutral-400 rounded-sm">
								<PlusIcon className="w-4 h-4 text-neutral-800" />
							</span>
							<p>Create Playlist</p>
						</button>
					</li>
					<li>
						<button className="list-item-button hover:brightness-125">
							<span className="flex align-middle p-[4px] text-center bg-purple-900 bg-gradient-to-tl from-indigo-400  rounded-sm">
								<HeartIcon className="w-4 h-4 text-neutral-300" />
							</span>
							<p>Liked Songs</p>
						</button>
					</li>
					<li>
						<button className="list-item-button hover:brightness-125">
							<span className="flex align-middle p-[4px] text-center bg-green-700 bg-gradient-to-b from-green-900 rounded-sm">
								<RssIcon className="w-4 h-4 text-green-300" />
							</span>
							<p>Your Episodes</p>
						</button>
					</li>
					<hr className="border-t-[1px] border-neutral-600 opacity-60" />
				</ul>
			</nav>
			<ul className="scroll-smooth pt-4 pb-32 pl-5 space-y-4 h-full overflow-y-scroll scrollbar-hidden">
				{playlists?.map((playlist, id) => (
					<li
						key={id}
						onClick={() => setPlaylistId(playlist?.id)}
						className={`${
							playlist.id === playlistId ? 'text-white' : ''
						} cursor-pointer hover:text-white truncate ...`}
					>
						{playlist?.name}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
