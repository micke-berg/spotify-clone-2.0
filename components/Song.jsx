import React from 'react';
import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { millisToMinutesAndSeconds } from '../lib/time';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { PlayIcon, PauseIcon } from '@heroicons/react/solid';

const Song = ({ order, track, trackId }) => {
	const spotifyApi = useSpotify();
	const [currentTrackId, setCurrentTrackId] =
		useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

	const handlePlayPause = () => {
		setCurrentTrackId(track?.track?.id);

		spotifyApi.getMyCurrentPlaybackState().then((data) => {
			if (data.body?.is_playing) {
				if (trackId === currentTrackId) {
					setIsPlaying(false);
					spotifyApi.pause();
				} else {
					setIsPlaying(true);
					spotifyApi.play({
						uris: [track?.track?.uri],
					});
				}
			} else {
				setIsPlaying(true);
				spotifyApi.play();
			}
		});
	};

	return (
		<li
			onClick={() => handlePlayPause()}
			className="group grid grid-cols-2 py-[5px] px-5 text-neutral-400 hover:bg-neutral-700 hover:bg-opacity-50 rounded-md cursor-pointer"
		>
			<div className="relative -left-6 flex items-center space-x-5">
				{trackId === currentTrackId ? (
					isPlaying ? (
						<PauseIcon className="absolute left-5 w-6 h-6 text-green-400 invisible group-hover:visible" />
					) : (
						<PlayIcon className="absolute left-5 w-6 h-6 text-neutral-100 invisible group-hover:visible" />
					)
				) : (
					<PlayIcon className="absolute left-5 w-6 h-6 text-neutral-100 invisible group-hover:visible" />
				)}
				<p
					className={`w-4 text-right ${
						trackId === currentTrackId ? 'text-green-400' : 'text-white'
					} text-white opacity-70 visible group-hover:invisible`}
				>
					{order + 1}
				</p>
				<img
					className="h-10 w-10 object-cover"
					src={track?.track?.album?.images[0]?.url}
					alt=""
				/>
				<div className="w-36 lg:w-64 truncate">
					<p
						className={`${
							trackId === currentTrackId ? 'text-green-400' : 'text-white'
						} text-ellipsis overflow-hidden ... `}
					>
						{track?.track?.name}
					</p>
					<p className="w-40 text-sm text-ellipsis overflow-hidden ...">
						{track?.track?.artists[0]?.name}
					</p>
				</div>
			</div>
			<div className="flex items-center justify-between ml-auto md:ml-0">
				<p className="hidden md:inline w-80 truncate text-sm">
					{track?.track?.album?.name}
				</p>
				<p className="ml-4">
					{millisToMinutesAndSeconds(track?.track?.duration_ms)}
				</p>
			</div>
		</li>
	);
};

export default Song;
