import { web3Store } from '../web3-store'
import day from 'dayjs'

const tetuFirstBlock = 17548231
const dateOfStartProject = new Date(2021, 7, 3, 19)

class ChartUtils {
  private readonly web3Store = web3Store

  getHoursAfterStart() {
    const currentDate = new Date()
    const hoursAfterStart = day(currentDate).diff(dateOfStartProject, 'hour')
    return { hoursAfterStart, currentDate }
  }

  async getBlocksAfterStart(itemCount: number = 20) {
    const curentBlock = await this.getCurentBlock()
    const diff = curentBlock - tetuFirstBlock
    const blockStep = Math.trunc(diff / itemCount)

    const { hoursAfterStart, currentDate } = this.getHoursAfterStart()
    const hoursStep = Math.trunc(hoursAfterStart / itemCount)

    const blocks = Array.from({ length: itemCount }).map((_, index) => {
      const idx = index + 1
      const block = tetuFirstBlock + idx * blockStep
      const timestamp = day(dateOfStartProject)
        .add(idx * hoursStep, 'hour')
        .toDate()

      return {
        block,
        timestamp,
      }
    })

    blocks.pop()

    blocks.push({
      block: curentBlock,
      timestamp: new Date(),
    })

    return blocks
  }

  getCurentBlock() {
    return this.web3Store.web3.eth.getBlockNumber()
  }
}

export const chartUtils = new ChartUtils()
