import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRecoilValue, useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify';
import useElementOnScreen from '../hooks/useElementOnScreen';
import { isPlayingState } from '../atoms/songAtom';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import { millisToMinutesAndSeconds } from '../lib/time';
import { FastAverageColor } from 'fast-average-color';
import PlayButton from './PlayButton';
import Songs from './Songs';

const fac = new FastAverageColor();

const Center = () => {
	const spotifyApi = useSpotify();
	const { data: session } = useSession();
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
	const [playlist, setPlaylist] = useRecoilState(playlistState);
	const playlistId = useRecoilValue(playlistIdState);
	const [playlistImageColor, setPlaylistImageColor] = useState('rgb(38 38 38)');
	const [containerRef, isVisible] = useElementOnScreen({
		threshold: 0.28,
		rootMargin: '50px',
	});

	const playlistOwner = playlist?.owner?.display_name;
	const numberOfSongs = playlist?.tracks?.items.length;
	const numberOfFollowers = playlist?.followers?.total
		? playlist?.followers?.total.toLocaleString()
		: null;

	const playlistArtists = playlist?.tracks?.items.map((x) => {
		return x.track?.artists[0].name;
	});
	const sumOfMillis = playlist?.tracks?.items
		.map((track) => {
			return track.track?.duration_ms;
		})
		.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	const totalListDuration = millisToMinutesAndSeconds(sumOfMillis).split(':');

	function msToFullTime(s) {
		const ms = s % 1000;
		s = (s - ms) / 1000;
		const secs = s % 60;
		s = (s - secs) / 60;
		const mins = s % 60;
		const hrs = (s - mins) / 60;

		if (s !== null) {
			return `${hrs ? hrs + ' hr' : ''} ${mins} min ${
				!hrs ? secs + ' sek' : ''
			} `;
		}
	}

	const [view, setView] = useState(false);

	useEffect(() => {
		if (playlist?.tracks?.items.length > 60) {
			setView(true);
		} else {
			setView(false);
		}
	}, [playlist?.tracks]);

	useEffect(() => {
		spotifyApi
			.getPlaylist(playlistId)
			.then((data) => {
				setPlaylist(data.body);
			})
			.catch((error) => console.log('Something went wrong!', error));
	}, [spotifyApi, playlistId]);

	useEffect(() => {
		function averageColor(image) {
			fac
				.getColorAsync(image)
				.then((color) => {
					setPlaylistImageColor(color.hex);
				})
				.catch((error) => {
					console.log(error);
				});
		}

		averageColor(playlist?.images[0]?.url);
	}, [playlist?.images]);

	return (
		<>
			<div
				className={`relative flex-grow w-screen h-screen overflow-y-scroll bg-neutral-900`}
			>
				<div>
					<div className="flex items-center">
						<div
							style={{
								background: `linear-gradient(to right,  rgb(23 23 23) 0%,${playlistImageColor} 100%)`,
							}}
							className={`shadow-2xl flex fixed items-center justify-start h-16 w-full px-8 z-10 top-0 ${
								view || isVisible ? 'opacity-100' : 'opacity-0'
							} transition-opacity duration-500 ease-in-out`}
						>
							<div className={`flex items-center space-x-3`}>
								<PlayButton className="my-8 bg-[#1ed760] scale-[0.85] hover:scale-[0.90] active:scale-[0.85] active:opacity-70" />
							</div>
							<p className="ml-3 text-white text-xl font-bold">
								{playlist?.name}
							</p>
						</div>
					</div>
					<div className="fixed z-10 top-4 right-8">
						<div
							onClick={signOut}
							className="group flex items-center p-[2px] md:pr-3 space-x-2 bg-neutral-900 hover:bg-neutral-700 cursor-pointers rounded-full text-white whitespace-nowrap cursor-pointer"
						>
							{session?.user?.image && (
								<img
									src={session?.user?.image}
									className="rounded-full w-8 h-8 md:w-7 md:h-7"
									alt=""
								/>
							)}
							<span className="hidden md:flex">
								<p className="text-sm font-semibold">
									<span className="inline-block group-hover:hidden">
										{session?.user?.name}
									</span>
									<span className="hidden group-hover:inline-block w-18">
										Logout
									</span>
								</p>
							</span>
						</div>
					</div>
				</div>

				<section
					style={{
						background: `linear-gradient(to top,  rgb(23 23 23) 0%,${playlistImageColor} 100%)`,
					}}
					className={`flex items-end w-full h-[380px] md:h-[460px] px-8 pb-20 space-x-7 text-white  brightness-110 `}
				>
					<span className="flex items-end w-full mb-12 space-x-7">
						<img
							src={playlist?.images[0]?.url}
							alt=""
							className="h-40 w-40 md:h-52 md:w-52 xl:h-60 xl:w-60 shadow-2xl"
						/>
						<div className="">
							<p className="text-xs font-bold mb-2">PLAYLIST</p>
							<h1 className="overflow-hidden mb-6 text-4xl md:text-5xl lg:text-7xl font-extrabold md:overflow-visible">
								{playlist?.name}
							</h1>
							{playlistOwner === 'Spotify' && (
								<p className="mb-4 text-sm font-light text-neutral-400">
									{`${playlistArtists?.slice(0, 3).join(', ')}${
										playlistArtists?.length > 3 ? ' and more' : ''
									}`}
								</p>
							)}

							<div className="flex items-center space-x-2 overflow-y-hidden truncate">
								{/* {playlistOwner && playlistOwner !== 'Spotify' ? (
									<img
										src={session?.user?.image}
										className="rounded-full w-5 h-5"
										alt="Playlist cover"
										ref={imgRef}
									/>
								) : null} */}
								<p className="text-sm font-semibold">{playlistOwner}</p>
								<span className="p-[2px] mt-1 bg-white rounded-full" />
								{numberOfFollowers && (
									<>
										<p className="text-sm font-light">{`${numberOfFollowers} likes`}</p>
										<span className="p-[2px] mt-1 bg-white rounded-full" />
									</>
								)}

								{numberOfSongs && (
									<p className="text-sm font-light">{numberOfSongs} songs,</p>
								)}
								{totalListDuration && (
									<p className="text-sm font-light text-neutral-400">
										{msToFullTime(sumOfMillis)}
									</p>
								)}
							</div>
						</div>
					</span>
				</section>
				<main ref={containerRef}>
					<Songs />
				</main>
			</div>
		</>
	);
};

export default Center;
