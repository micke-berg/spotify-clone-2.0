import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import Center from '../components/Center';
import { getSession } from 'next-auth/react';

const Home: NextPage = () => {
	return (
		<div className="bg-black h-screen overflow-hidden">
			<Head>
				<title>Spotfy - Clone</title>
				<link
					rel="icon"
					sizes="32x32"
					type="image/png"
					href="https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png"
				></link>
			</Head>
			<main className="flex">
				<Sidebar />
				<Center />
			</main>
			<div className="sticky bottom-0">
				<Player />
			</div>
		</div>
	);
};

export default Home;

export async function getServerSideProps(context: any) {
	const session = await getSession(context);

	return {
		props: {
			session,
		},
	};
}
