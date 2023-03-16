import { Col, Row } from 'antd'
import { Post, PostType } from './types'
import styles from './News.module.scss'
import { useEffect, useState } from 'react'
import Carousel from 'better-react-carousel'
import { mock } from './mock'
import LinkIcon from '../../../../static/arrow-link.svg'

type PostProps = {
  data: Post
}

const TextPost: React.FC<PostProps> = (props) => {
  const { title, description, link } = props.data

  if (link) {
    return (
      <a href={link} target="_blank" className={`${styles.post} post`} rel="noreferrer">
        {title && <p className={styles.postTitle}>{title}</p>}
        {description && <p className={styles.postDescription}>{description}</p>}
        {link && (
          <p className={styles.postLink}>
            twitter.com <img src={LinkIcon} width="10px" style={{ marginLeft: 3 }} />
          </p>
        )}
      </a>
    )
  }

  return (
    <div className={`${styles.post} post`}>
      {title && <p className={styles.postTitle}>{title}</p>}
      {description && <p className={styles.postDescription}>{description}</p>}
    </div>
  )
}

const VideoPost: React.FC<PostProps> = (props) => {
  const { title, link } = props.data

  return (
    <a href={link} className={`${styles.post} ${styles.postVideo}`}>
      <Row align="middle" gutter={20} wrap={false}>
        <Col>
          <div className={styles.buttonPlay} />
        </Col>
        <Col>
          <p className={`${styles.postTitle} ${styles.postVideoTitle}`}>{title}</p>
        </Col>
      </Row>
    </a>
  )
}

const PostElement: React.FC<PostProps> = (props) => {
  const { type } = props.data

  if (type === PostType.Youtube) {
    return <VideoPost data={props.data} />
  }

  if (type === PostType.Twitter) {
    return <TextPost data={props.data} />
  }

  return <TextPost data={props.data} />
}

export const News: React.FC = () => {
  const [data, setData] = useState<null | any[]>(null)

  useEffect(() => {
    // const posts = mock?.map((item: any) => {
    //   return {
    //     link: `https://twitter.com/tetu_io/status/${item.tweet_id}`,
    //     type: PostType.Twitter,
    //     description: item.text,
    //   }
    // })

    // setData(posts)

    fetch('https://twitter154.p.rapidapi.com/user/tweets?username=tetu_io&limit=10', {
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY as string,
        'X-RapidAPI-Host': 'twitter154.p.rapidapi.com',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const posts = result?.results?.map((item: any) => {
          return {
            link: `https://twitter.com/tetu_io/status/${item.tweet_id}`,
            type: PostType.Twitter,
            description: item.text,
          }
        })
        setData(posts)
      })
      .catch((error) => console.log('error', error))
  }, [])

  // useEffect(() => {
  //   fetch('https://mediumpostsapi.vercel.app/api/tetu.finance')
  //     // fetch('https://mediumpostsapi.vercel.app/api/davidfernandodamata21')
  //     .then((response) => response.text())
  //     .then((result) => {
  //       setData(JSON.parse(result)?.dataMedium)
  //     })
  //     .catch((error) => console.log('error', error))
  // }, [])

  // useEffect(() => {
  //   var CHANNEL_ID = 'UCTsUrstXOGrNKqpf4GRsXmQ'
  //   var URL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`

  //   fetch(URL)
  //     .then((result) => {
  //       console.log('result', result)
  //       return result.json()
  //     })
  //     .then((result) => {
  //       console.log('result', result)

  //       const posts = result.items?.map((item: any) => {
  //         return {
  //           type: PostType.Youtube,
  //           title: item.snippet.title,
  //           link: `http://www.youtube.com/watch?v=${item.id.videoId}`,
  //           published: item.snippet.publishedAt,
  //         }
  //       })

  //       if (posts?.length) {
  //         setData(posts)
  //       }

  //       console.log('posts', posts)
  //     })
  //     .catch((error) => console.log('error', error))
  // }, [])

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <Row gutter={[0, { xs: 20, sm: 32 }]}>
          <Col span={24}>
            <div>
              <Row gutter={34} align="middle">
                <Col>
                  <p className={styles.title}>News feed</p>
                </Col>
                {/* <Col>
                  <Row gutter={20} align="middle" className={styles.controls}>
                    <Col style={{ display: 'inline-flex' }}>
                      <button className={`${styles.control} ${styles.controlLeft}`} />
                    </Col>
                    <Col style={{ display: 'inline-flex' }}>
                      <button
                        className={`${styles.control} ${styles.controlRight} ${styles.controlDisabled}`}
                      />
                    </Col>
                  </Row>
                </Col> */}
              </Row>
            </div>
          </Col>
          <Col span={24}>
            <Carousel
              cols={3}
              rows={1}
              gap={32}
              containerStyle={{ margin: 0 }}
              scrollSnap={true}
              mobileBreakpoint={1}
              responsiveLayout={[
                {
                  breakpoint: 991,
                  cols: 2,
                  rows: 1,
                  gap: 32,
                },
                {
                  breakpoint: 575,
                  cols: 1,
                  rows: 1,
                  gap: 16,
                },
              ]}
            >
              {data?.map((post, index: number) => (
                <Carousel.Item>
                  <PostElement data={post} />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </div>
    </div>
  )
}
