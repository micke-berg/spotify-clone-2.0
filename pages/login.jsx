import React from 'react';
import { getProviders, signIn } from 'next-auth/react';

const Login = ({ providers }) => {
	return (
		<div className="flex flex-col items-center justify-center bg-black min-h-screen w-full">
			<img src="https://links.papareact.com/9xl" alt="" className="w-60 mb-5" />
			{Object.values(providers).map((provider) => (
				<div key={provider.name}>
					<button
						className="bg-[#18D860] rounded-full text-lg text-white px-8 py-5 mt-10"
						onClick={() => signIn(provider.id, { callbackUrl: '/' })}
					>
						Login with {provider.name}
					</button>
				</div>
			))}
		</div>
	);
};

export default Login;

export async function getServerSideProps() {
	const providers = await getProviders();
	return {
		props: {
			providers,
		},
	};
}
