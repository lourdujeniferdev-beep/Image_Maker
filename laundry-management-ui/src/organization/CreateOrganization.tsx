(function ensureFileExists() {
	// placeholder component to satisfy imports
})();

import { useState } from "react";

export default function CreateOrganization() {
	const [name, setName] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert(`Create organization: ${name}`);
	};

	return (
		<div className="p-6">
			<h1 className="mb-6 text-3xl font-bold">Create Organization</h1>
			<form onSubmit={handleSubmit} className="max-w-md">
				<input
					name="name"
					placeholder="Organization Name"
					className="mb-4 w-full border p-3"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<button className="rounded bg-blue-600 px-6 py-3 text-white">Create</button>
			</form>
		</div>
	);
}

