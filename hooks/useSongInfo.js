import React, { useState, useEffect } from 'react';
import useSpotify from './useSpotify';
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from '../atoms/songAtom';

const useSongInfo = () => {
	const spotifyApi = useSpotify();
	const [currentIdTrack, setCurrentTrackId] =
		useRecoilState(currentTrackIdState);
	const [songInfo, setSongInfo] = useState(null);

	useEffect(() => {
		const fetchSongInfo = async () => {
			if (currentIdTrack) {
				await fetch(`https://api.spotify.com/v1/tracks/${currentIdTrack}`, {
					headers: {
						Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
					},
				})
					.then((res) => res.json())
					.then((response) => setSongInfo(response));
			}
		};

		fetchSongInfo();
	}, [currentIdTrack, spotifyApi]);

	return songInfo;
};

export default useSongInfo;
