import Fuse from 'fuse.js'
import { NextSeo } from 'next-seo'
import * as React from 'react'
import useSWR from 'swr'

import { websiteListIDN, websiteListUSA } from '../_data/websites'
import { WebsiteEntry } from '../components/WebsiteEntry'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const IndexPage = () => {
  const { data, error } = useSWR('/api/fetchEntries', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: false
  })

  const fuseInstance = React.useRef<any>(null)
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    if (data == null) return

    fuseInstance.current = new Fuse(data.data, {
      keys: ['attributes.website'],
      isCaseSensitive: true,
      threshold: 0.8
    })
  }, [data])

  return (
    <>
      <NextSeo />

      <div className='flex w-full justify-center'>
        <div className='w-full max-w-screen-xl p-8'>
          <div className='flex w-full flex-col items-center'>
            <h1 className='text-5xl font-bold italic'>Kominfo&apos;d?</h1>
            <span>Website ini bakal keblokir ga ya?</span>
          </div>

          {/* <div>
            <h2 className='text-2xl font-semibold'>Top websites Indonesia (non-news outlet)</h2>
            <p>
              2022 Top websites in Indonesia. Sumber data website diambil dari{' '}
              <a
                href='https://www.similarweb.com/top-websites/indonesia/'
                className='text-blue-700 underline'
                target='_blank'
                rel='noreferrer'
              >
                semrush.com
              </a>
            </p>
            <p>
              <em>Catatan: Ada beberapa website ditiadakan karena tidak berhubungan</em>
            </p>
            <div className='mt-4 grid grid-flow-row grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {websiteListIDN.map((website) => (
                <WebsiteEntry
                  website={website.icon}
                  key={website.icon.title}
                  loading={data == null}
                  pass={
                    // TODO: Properly type this
                    data?.data.filter(
                      (e: { attributes: { website: string } }) =>
                        e.attributes.website === website.website
                    ).length > 0
                  }
                />
              ))}
            </div>
          </div> */}

          <div className='mt-16'>
            <h2 className='text-2xl font-semibold'>Top websites USA</h2>
            <p>
              2022 Top websites in the USA. Sumber data website diambil dari{' '}
              <a
                href='https://www.semrush.com/blog/most-visited-websites/'
                className='text-blue-700 underline'
                target='_blank'
                rel='noreferrer'
              >
                semrush.com
              </a>
            </p>
            <p>
              <em>Catatan: Ada beberapa website ditiadakan karena tidak berhubungan</em>
            </p>
            <div className='mt-4 grid grid-flow-row grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {websiteListUSA.map((website) => (
                <WebsiteEntry
                  website={website.icon}
                  key={website.icon.title}
                  loading={data == null}
                  pass={
                    // TODO: Properly type this
                    data?.data.filter((e: { attributes: { website: string } }) =>
                      e.attributes.website.toLowerCase().startsWith(website.website)
                    ).length > 0
                  }
                />
              ))}
            </div>
          </div>

          <div className='mt-8'>
            <h2 className='text-2xl font-semibold'>Cari manual (in active development)</h2>
            Jika situs tidak tertampil diatas, anda bisa mencari situs tersebut di sini:{' '}
            <input type='search' onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          {data && fuseInstance.current != null && (
            <>
              <pre className='overflow-scroll overflow-y-hidden'>
                {JSON.stringify(
                  (fuseInstance.current as Fuse<unknown>).search(searchQuery),
                  null,
                  2
                )}
              </pre>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default IndexPage
