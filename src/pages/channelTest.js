import { getPlaylist, getChannelInfo } from "./utils/youtube";
import { useState, useRef } from "react";
import classNames from "classnames";
import { formatDistance } from "date-fns";
import Image from "next/image";

import linkifyHtml from "linkify-html";
import Link from 'next/link';
import { useRouter } from 'next/router'

export default function Channel({ title, videos }) {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
    const currentVideoRef = useRef(null);
    const router = useRouter()

    function selectVideoByIndex(index) {
        router.push(`/${videos[index].snippet.resourceId.videoId}`)
    }
    return (
        <div>
            <div className="mx-auto max-w-6xl p-8 lg:p-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl my-4 font-bold">{title}</h1>
            </div>
            <div className={classNames("bg-gray-200 pt-20 p-12 mb-4 relative", {
                hidden: currentVideoIndex == null,
            })} ref={currentVideoRef}>

            </div>
           
            {currentVideoIndex != null && (
                <>
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe
                            src={`https://www.youtube.com/embed/${videos[currentVideoIndex].snippet.resourceId.videoId}?autoplay=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <h2 className="text-3xl font-medium my-6">
                        {videos[currentVideoIndex].snippet.title}
                    </h2>
                    <h2 className="text-3xl font-medium my-6">
                        {videos[currentVideoIndex].snippet.resourceId.videoId}
                    </h2>
                    <p
                        className="prose"
                        dangerouslySetInnerHTML={{
                            __html: linkifyHtml(
                                videos[currentVideoIndex].snippet.description?.replace(
                                    /\n/g,
                                    " <br />"
                                ),
                                {
                                    target: { url: "_blank" },
                                }
                            ),
                        }}
                    ></p>
                </>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
               
                {(videos !== undefined) ? videos.map(
                    (
                        {
                            snippet: {
                                title,
                                publishedAt,
                                thumbnails,
                                resourceId: {
                                    videoId,
                                },
                            },
                        },
                        index
                    ) => {
                        return (
                            <button
                                key={videoId}
                                className="text-left"
                                onClick={() => selectVideoByIndex(index)}
                            >
                                <Image
                                    src={thumbnails.medium?.url}
                                    height={thumbnails.medium?.height}
                                    width={thumbnails.medium?.width}
                                />
                                <div className="flex flex-col justify-between mt-2">
                                    <div className="line-clamp-2 text-sm font-medium">
                                        {title}
                                    </div>
                                    <div className="text-gray-700 text-xs mt-2">
                                        {formatDistance(new Date(publishedAt), new Date())}
                                    </div>
                                </div>
                            </button>
                        );
                    }
                ) : null}<br/>
                <iframe className="place-content-center" src="https://www.instagram.com/resterjeune.com_officiel/embed" width="640" height="400" allowtransparency="true"></iframe>
            </div>
        </div>
    )
}

export async function getServerProps({ query }) {
    const id = query;
    const info = await getServerProps(id);

    if (info.pageInfo.results === 0) {
        return {
            notFound: true,
        }
    }

    const playlistId = info.items[0].contentDetails.relatedPlaylists.uploads;
    const title = info.items[0].snippet.title;
    const videos = await getPlaylist(playlistId);

    return {
        props: {
            title,
            videos,
        },
    }
}