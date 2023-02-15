import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { getPlaylist, getChannelInfo } from './utils/youtube'
import Channel from './channelTest'

const inter = Inter({ subsets: ['latin'] })

export default function Home({ title, videos }) {
  return (
    <>
      <Head>
        <title>Rester-Jeune.com</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="place-content-center">
        <Channel title={title} videos={videos} />
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const info = await getChannelInfo();
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