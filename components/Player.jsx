import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useRecoilState } from 'recoil';
import { useSession } from 'next-auth/react';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';
import usePrevious from '../hooks/usePrevious';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { VolumeUpIcon, VolumeOffIcon } from '@heroicons/react/solid';
import { BiShuffle } from 'react-icons/bi';
import { IoIosSkipBackward, IoIosSkipForward } from 'react-icons/io';
import { TbRepeat, TbRepeatOnce } from 'react-icons/tb';
import PlayButton from './PlayButton';

const Player = () => {
	const spotifyApi = useSpotify();
	const { data: session } = useSession();
	const songInfo = useSongInfo();
	const [currentTrackId, setCurrentTrackId] =
		useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(50);
	const [isShuffle, setIsShuffle] = useState(false);
	const [isRepeat, setIsRepeat] = useState('off');
	const [currentPosition, setCurrentPosition] = useState(0);
	const [trackDuration, setTrackDuration] = useState(0);

	function msToFullTime(s) {
		const ms = s % 1000;
		s = (s - ms) / 1000;
		const secs = s % 60;
		s = (s - secs) / 60;
		const mins = s % 60;
		const hrs = (s - mins) / 60;
		// This can only be true if the value is NaN
		const valueIsNaN = s !== s;

		if (s !== null && !valueIsNaN) {
			return `${mins}:${secs < 10 ? '0' : ''}${secs} `;
		}
	}

	const currentPos = msToFullTime(currentPosition);
	const trackDur = msToFullTime(trackDuration);

	useEffect(() => {
		let interval = setInterval(() => {
			spotifyApi.getMyCurrentPlaybackState().then((data) => {
				console.log('PlaybackState', data.body);
				setIsPlaying(data.body?.is_playing);
				setCurrentPosition(data?.body?.progress_ms);
			});

			spotifyApi.getMyCurrentPlayingTrack().then((data) => {
				console.log('Now playing ', data.body?.item);
				setCurrentTrackId(data?.body?.item?.id);
				setTrackDuration(data?.body?.item?.duration_ms);
				setCurrentPosition(data?.body?.progress_ms);
			});
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	// useEffect(() => {
	// 	spotifyApi.getMyCurrentPlaybackState().then((data) => {
	// 		console.log('PlaybackState', data.body);
	// 		setIsPlaying(data.body?.is_playing);
	// 		setCurrentPosition(data?.body?.progress_ms);
	// 	});

	// 	spotifyApi.getMyCurrentPlayingTrack().then((data) => {
	// 		console.log('Now playing ', data.body?.item);
	// 		setCurrentTrackId(data?.body?.item?.id);
	// 		setTrackDuration(data?.body?.item?.duration_ms);
	// 		setCurrentPosition(data?.body?.progress_ms);
	// 	});
	// }, [isPlaying]);

	const fetchCurrentSong = () => {
		if (!songInfo) {
			console.log('no songInfo');
			spotifyApi.getMyCurrentPlayingTrack().then((data) => {
				console.log('Now playing ', data?.body?.item);
				setCurrentTrackId(data?.body?.item?.id);
				setTrackDuration(data?.body?.item?.duration_ms);

				spotifyApi.getMyCurrentPlaybackState().then((data) => {
					console.log('PlaybackState', data.body);
					setIsPlaying(data?.body?.is_playing);
					setCurrentPosition(data?.body?.progress_ms);
					// setIsRepeat(data.body?.repeat_state);
				});
			});
		}
	};

	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
			fetchCurrentSong();
			setVolume(50);
		}
		// repeatSong();
		// fetchMyDevices();
	}, [currentTrackId, spotifyApi, session]);

	const skipToPrevious = () => {
		console.log('Skip to previous...');
		// Skip User’s Playback To Previous Track
		// spotifyApi.skipToPrevious().then(
		// 	function () {
		// 		console.log('Skip to previous');
		// 	},
		// 	function (err) {
		// 		//if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
		// 		console.log('Something went wrong!', err);
		// 	}
		// );
	};

	const skipToNext = () => {
		console.log('Skip to next...');

		// Skip User’s Playback To Next Track
		spotifyApi.skipToNext().then(
			function () {
				console.log('Skip to next');
			},
			function (err) {
				//if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
				console.log('Something went wrong!', err);
			}
		);
	};

	const repeatSong = () => {
		console.log('Repeat...');

		// spotifyApi.getMyCurrentPlaybackState().then((data) => {
		// 	console.log('repeat State', data.body?.repeat_state);
		// 	switch (data.body?.repeat_state) {
		// 		case 'off': {
		// 			setIsRepeat('context');
		// 			break;
		// 		}
		// 		case 'context': {
		// 			setIsRepeat('track');
		// 			break;
		// 		}
		// 		case 'track': {
		// 			setIsRepeat('off');
		// 			break;
		// 		}
		// 	}
		// });
		// spotifyApi
		// 	.setRepeat(isRepeat)
		// 	.then(() => console.log('Repeat track...', isRepeat))
		// 	.catch((err) => console.log('Something went wrong!', err));
	};

	const shufflePlaylist = () => {
		console.log('Shuffle...');

		// spotifyApi.getMyCurrentPlaybackState().then((data) => {
		// 	// console.log('Shuffle state', data.body?.shuffle_state);
		// 	if (data.body?.shuffle_state === true) {
		// 		setIsShuffle(false);
		// 	} else {
		// 		setIsShuffle(true);
		// 	}
		// });
		// spotifyApi
		// 	.setShuffle(isShuffle)
		// 	.catch((err) => console.log('Something went wrong!', err));
	};

	const debouncedAdjustVolume = useCallback(
		debounce((volume) => {
			spotifyApi.setVolume(volume).catch((err) => {
				console.log('err', err);
			});
		}, 500),
		[]
	);

	useEffect(() => {
		if (volume >= 0 && volume < 100) {
			debouncedAdjustVolume(volume);
		}
	}, [volume]);

	const prevCount = usePrevious(volume);

	return (
		<div className="grid grid-cols-3 text-sm md:text-base px-2 md:px-4 text-white h-24 w-full bg-neutral-900 border-t-[1px] border-neutral-600 border-opacity-50 shadow-lg">
			<div className="flex items-center space-x-4">
				{songInfo ? (
					<img
						src={songInfo?.album?.images[0]?.url}
						alt=""
						className="h-14 w-14 md:inline hidden"
					/>
				) : null}

				<div>
					<h3 className="text-sm font-light truncate overflow-hidden">
						{songInfo?.name}
					</h3>
					<p className="text-xs text-neutral-400">
						{songInfo?.artists?.[0].name}
					</p>
				</div>
			</div>
			<div className="shadow-xl shadow-neutral-900 relative z-20 flex min-w-max flex-col  justify-center space-y-3 bg-neutral-900 px-3">
				<div className="flex items-center justify-center ">
					<span className="relative mr-5">
						<BiShuffle
							onClick={() => shufflePlaylist()}
							className={`h-5 w-5 cursor-pointer hidden sm:inline ${
								isShuffle ? 'text-green-400' : 'text-neutral-400'
							} hover:text-white transition-colors duration-100 ease-in`}
						/>
						{isShuffle && (
							<span className="absolute right-[10px] top-[26px] p-[2px] bg-green-400 rounded-full" />
						)}
					</span>

					<IoIosSkipBackward
						onClick={() => skipToPrevious()}
						className="w-6 h-6 text-neutral-400 hover:text-white"
					/>
					<PlayButton
						size="20"
						className="w-9 h-9 mx-5 min-w-9 min-h-9 hover:scale-105 active:scale-100 bg-gray-300"
					/>
					<IoIosSkipForward
						onClick={() => skipToNext()}
						className="w-6 h-6 mr-5 text-neutral-400 hover:text-white"
					/>
					<span className="hidden sm:inline">
						{isRepeat === 'track' ? (
							<span className="relative ">
								<TbRepeatOnce
									onClick={() => repeatSong()}
									className={`relative h-5 w-5 cursor-pointer text-green-400 `}
								/>
								<span className="icon-active right-[7px] top-[23px] p-[2px]" />
							</span>
						) : isRepeat === 'context' ? (
							<span className="relative">
								<TbRepeat
									onClick={() => repeatSong()}
									className={`h-5 w-5 cursor-pointer hover:text-white text-green-400 
									`}
								/>
								<span className="icon-active right-[7px] top-[23px] p-[2px] " />
							</span>
						) : (
							<TbRepeat
								onClick={() => repeatSong()}
								className={`h-5 w-5 cursor-pointer hover:text-white  text-neutral-400`}
							/>
						)}
					</span>
				</div>
				<div className="flex items-center justify-between space-x-2">
					<p className="text-xs text-gray-400">{currentPos || '0:00'}</p>
					<input
						type="range"
						value={currentPosition || 0}
						min={0}
						max={trackDuration || 100}
						className="w-full h-1 bg-neutral-400 rounded-lg "
					/>
					<p className="text-xs text-gray-400">{trackDur || '0:00'}</p>
				</div>
			</div>
			<div className="relative z-10 flex items-center justify-end space-x-3 pr-5 text-neutral-400 bg-neutral-900">
				{volume === 0 ? (
					<VolumeOffIcon
						onClick={() => setVolume(prevCount)}
						className="button"
					/>
				) : (
					<VolumeUpIcon onClick={() => setVolume(0)} className="button" />
				)}

				<input
					type="range"
					value={volume || 0}
					min={0}
					max={100}
					className="w-14 md:w-28 h-1 bg-neutral-400 rounded-lg "
					onChange={(e) => setVolume(Number(e.target.value))}
				/>
			</div>
		</div>
	);
};

export default Player;
