import { Post } from "./types";

import yieldFarmingData1Icon from "../../../../static/showcase/yieldFarmingData_1_icon.png";
import veTETU_glass_icon from "../../../../static/showcase/veTETU_glass_icon.png";
import liquidStakingData1Icon from "../../../../static/showcase/liquidStakingData_1_icon.png";
import liquidStakingData2Icon from "../../../../static/showcase/liquidStakingData_2_icon.png";
import liquidStakingData3Icon from "../../../../static/showcase/liquidStakingData_3_icon.png";

import yieldFarmingData1BG from "../../../../static/showcase/yieldFarmingData1BG.png";
import yieldFarmingData2BG from "../../../../static/showcase/yieldFarmingData2BG.png";
import liquidStakingData1BG from "../../../../static/showcase/liquidStakingData1BG.png";
import liquidStakingData2BG from "../../../../static/showcase/liquidStakingData2BG.png";
import liquidStakingData3BG from "../../../../static/showcase/liquidStakingData3BG.png";
import { resourcesLinks } from "../../../../App/constants";

export const yieldFarmingData: Post[] = [
    {
        title: 'Tetu v1',
        description: 'A classic yield aggregator with vaults!',
        backgroundPath: yieldFarmingData1BG,
        backgroundIconPath: yieldFarmingData1Icon,
        link: "/console",
    },
    {
        title: 'Tetu v2',
        description: 'Boost your earnings, vote for gauges, and participate in governance with veTETU',
        backgroundPath: yieldFarmingData2BG,
        backgroundIconPath: veTETU_glass_icon,
        link: resourcesLinks.tetuV2,
        blankLink: true,
    },
]

export const liquidStakingData: Post[] = [
    {
        title: 'TetuQi',
        description: 'Enjoy all the benefits of permanently locking Qi tokens while having the freedom to exit the staking pool anytime!',
        backgroundPath: liquidStakingData1BG,
        backgroundIconPath: liquidStakingData1Icon,
        link: "/tetuqi",
    },
    {
        title: 'TetuBal',
        description: 'Contribute to the customizable liquidity pool and earn TetuBAL in return',
        backgroundPath: liquidStakingData2BG,
        backgroundIconPath: liquidStakingData2Icon,
        link: "/tetubal",
    },
    // {
    //     title: 'TetuMesh',
    //     description: 'Get maximum MESH benefits with an option to exit the pool anytime!',
    //     backgroundPath: liquidStakingData3BG,
    //     backgroundIconPath: liquidStakingData3Icon,
    //     link: "/tetumesh",
    // },
]

export const dexData: Post[] = [
    {
        title: 'Tetu Swap',
        description: 'Earn appetizing profits from yield farming and swap fees when you add liquidity to the pool',
        backgroundPath: yieldFarmingData2BG,
        backgroundIconPath: yieldFarmingData1Icon,
        link: "https://swap.tetu.io/",
        blankLink: true,
    }
]
