import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify';
import { isPlayingState } from '../atoms/songAtom';

const PlayButton = ({ size = 28, className }) => {
	const spotifyApi = useSpotify();
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

	const handlePlayPause = () => {
		spotifyApi.getMyCurrentPlaybackState().then((data) => {
			if (data.body?.is_playing) {
				spotifyApi.pause();
				setIsPlaying(false);
			} else {
				spotifyApi.play();
				setIsPlaying(true);
			}
		});
	};

	const play = (
		<span onClick={() => handlePlayPause()}>
			<svg
				role="img"
				height={size}
				width={size}
				aria-hidden="true"
				viewBox="0 0 24 24"
				className="Svg-sc-ytk21e-0 uPxdw"
			>
				<path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
			</svg>
		</span>
	);

	const pause = (
		<span onClick={() => handlePlayPause()}>
			<svg
				role="img"
				height={size}
				width={size}
				aria-hidden="true"
				viewBox="0 0 24 24"
				className="Svg-sc-ytk21e-0 uPxdw"
			>
				<path d="M5.7 3a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7H5.7zm10 0a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7h-2.6z"></path>
			</svg>
		</span>
	);

	return (
		<div
			className={`flex items-center justify-center rounded-full  active:scale-100 transition-all ease-in-out duration-100 w-14 h-14 ${className}`}
		>
			{isPlaying ? pause : play}
		</div>
	);
};

export default PlayButton;
