import { Col, Row } from 'antd'
import { yieldFarmingData, liquidStakingData, dexData } from './data'
import { Post } from './types'
import styles from './Cases.module.scss'
import { Link } from 'react-router-dom'

type PostProps = {
  data: Post
  index: number
}

const PostElement: React.FC<PostProps> = (props) => {
  const { data, index } = props
  const { title, description, backgroundPath, backgroundIconPath, link, blankLink } = data

  if (blankLink) {
    return (
      <a href={link}>
        <div className={styles.post} style={{ backgroundImage: `url(${backgroundPath})` }}>
          <div className={styles.postContent}>
            <p className={styles.caseTitle}>{title}</p>
            <p className={styles.caseDescription}>{description}</p>
          </div>
          <img className={styles.postImg} src={backgroundIconPath} />
        </div>
      </a>
    )
  }

  return (
    <Link to={link!}>
      <div className={styles.post} style={{ backgroundImage: `url(${backgroundPath})` }}>
        <div className={styles.postContent}>
          <p className={styles.caseTitle}>{title}</p>
          <p className={styles.caseDescription}>{description}</p>
        </div>
        <img className={styles.postImg} src={backgroundIconPath} />
      </div>
    </Link>
  )
}

export const Cases: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className="container">
        <Row gutter={[0, 56]} className={styles.antRowOuter}>
          <Col span={24}>
            <Row gutter={[0, 32]} className={styles.antRow}>
              <Col span={24}>
                <p className={styles.title}>Yield farming</p>
              </Col>
              <Col span={24}>
                <Row gutter={[32, 32]} className={styles.antRowItems}>
                  {yieldFarmingData.map((post, index) => (
                    <Col span={8} className={styles.antCol}>
                      <PostElement data={post} index={index} />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row gutter={[0, 32]} className={styles.antRow}>
              <Col span={24}>
                <p className={styles.title}>Liquid Staking</p>
              </Col>
              <Col span={24}>
                <Row gutter={[32, 32]} className={styles.antRowItems}>
                  {liquidStakingData.map((post, index) => (
                    <Col span={8} className={styles.antCol}>
                      <PostElement data={post} index={index} />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Col>
          {/*<Col span={24}>*/}
          {/*  <Row gutter={[0, 32]} className={styles.antRow}>*/}
          {/*    <Col span={24}>*/}
          {/*      <p className={styles.title}>DEX</p>*/}
          {/*    </Col>*/}
          {/*    <Col span={24}>*/}
          {/*      <Row gutter={[32, 32]} className={styles.antRowItems}>*/}
          {/*        {dexData.map((post, index) => (*/}
          {/*          <Col span={8} className={styles.antCol}>*/}
          {/*            <PostElement data={post} index={index} />*/}
          {/*          </Col>*/}
          {/*        ))}*/}
          {/*      </Row>*/}
          {/*    </Col>*/}
          {/*  </Row>*/}
          {/*</Col>*/}
        </Row>
      </div>
    </div>
  )
}
