'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DonatePage() {
	return (
		<div className="min-h-screen">
			{/* Header */}
			<div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
				<Link href="/home" className="text-2xl">←</Link>
				<h1 className="text-xl font-semibold">Donate</h1>
				<div className="w-8"></div>
			</div>

			{/*
			<table>
				<tbody><tr>
					<td><Image src="/images/graphics/transform_dreams_into_reality.png" width={340} height={603}/></td>
				</tr></tbody>
			</table>
			*/}
		</div>
	);
}
