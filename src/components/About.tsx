import React from 'react';

import config from '../config/index.json';
import Link from 'next/link';

const About = (() => {
    const { socialMedia, sections } = config.about;

    return (
        <div id="about" className="mx-auto container xl:px-20 lg:px-12 sm:px-6 px-4">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-wrap gap-x-4 items-center justify-center mt-4">
                        {
                            sections.map((section, index) => (
                                <div key={index}>
                                    <Link
                                        className={`hover:text-primary text-base cursor-pointer leading-4 text-gray-800 dark:text-gray-400 dark:hover:text-white`}
                                        href={section.href}
                                    >
                                        {section.name}
                                    </Link>
                                </div>
                            ))
                        }
                </div>
                <div className="flex items-center gap-x-8 mt-auto h-8">
                    <a aria-label="github" href={socialMedia.github} target="_blank" rel="noreferrer">
                        <svg
                            className="fill-current text-gray-800 dark:text-white hover:text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <a aria-label="linkedin" href={socialMedia.linkedin} target="_blank" rel="noreferrer">
                        <svg
                            className="fill-current text-gray-800 dark:text-white hover:text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </a>
                    <a aria-label="telegram" href={socialMedia.telegram} target="_blank" rel="noreferrer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            id="Livello_1" data-name="Livello 1" viewBox="0 0 240 240"
                            width="24"
                            height="24">
                            <defs>
                                <linearGradient id="linear-gradient" x1="120" y1="240" x2="120"
                                                gradientUnits="userSpaceOnUse">
                                    <stop offset="0" stopColor="#1d93d2" />
                                    <stop offset="1" stopColor="#38b0e3" />
                                </linearGradient>
                            </defs>
                            <title>Telegram_logo</title>
                            <circle cx="120" cy="120" r="120" fill="url(#linear-gradient)"
                                    className="fill-current text-gray-800 dark:text-white hover:text-primary" />
                            <path
                                d="M81.229,128.772l14.237,39.406s1.78,3.687,3.686,3.687,30.255-29.492,30.255-29.492l31.525-60.89L81.737,118.6Z"
                                fill="#c8daea" />
                            <path d="M100.106,138.878l-2.733,29.046s-1.144,8.9,7.754,0,17.415-15.763,17.415-15.763"
                                  fill="#a9c6d8" />
                            <path
                                d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z"
                                fill="#fff" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
});
export default About;
