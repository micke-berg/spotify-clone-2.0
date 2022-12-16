import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import { ClockIcon } from '@heroicons/react/outline';
import PlayButton from './PlayButton';
import Song from './Song';

const Songs = () => {
	const playlist = useRecoilValue(playlistState);

	const generateKey = (pre) => {
		return `${pre}_${new Date().getTime()}`;
	};

	return (
		<div className="relative flex flex-col h-full min-h-screen -mt-24 pb-32 pt-24 px-8 space-y-1 text-white bg-neutral-900 bg-opacity-30 shadow-xl">
			<PlayButton className="absolute -top-2 my-8 w-14 h-14 bg-[#1ed760] scale-105 hover:scale-[1.10] active:scale-100 active:opacity-70" />
			<div className="grid grid-cols-2 sticky z-10 top-16 pb-1 px-6 mt-1 text-xs text-neutral-300 bg-neutral-900 shadow-sm ">
				<div className="flex items-center">
					<span className="mr-4 text-lg text-neutral-400">#</span>
					<p>TITLE</p>
				</div>
				<div className="flex items-center justify-between ml-auto md:ml-0">
					<p className="hidden md:inline">ALBUM</p>
					<ClockIcon className="w-5 h-5" />
				</div>
			</div>
			<hr className="pb-2 border-t-[1px] border-neutral-600 opacity-40" />
			<ul>
				{playlist?.tracks?.items.map((track, i) => (
					<Song
						key={generateKey(i)}
						order={i}
						track={track}
						trackId={track?.track?.id}
					/>
				))}
			</ul>
		</div>
	);
};

export default Songs;
