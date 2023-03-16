import { ethers } from 'ethers'

// export class Erc20Utils {

//     public static async balanceOf(tokenAddress: string, account: string): Promise<BigNumber> {
//         const token = await ethers.getContractAt("IERC20", tokenAddress) as IERC20;
//         return await token.balanceOf(account);
//     }

//     public static async approve(tokenAddress: string, signer: SignerWithAddress, spender: string, amount: string) {
//         const token = await ethers.getContractAt("IERC20", tokenAddress, signer) as IERC20;
//         await token.approve(spender, BigNumber.from(amount));
//     }

//     public static async allowance(tokenAddress: string, signer: SignerWithAddress, spender: string): Promise<BigNumber> {
//         const token = await ethers.getContractAt("IERC20", tokenAddress, signer) as IERC20;
//         return await token.allowance(signer.address, spender);
//     }

//     public static async transfer(tokenAddress: string, signer: SignerWithAddress, destination: string, amount: string) {
//         const token = await ethers.getContractAt("IERC20", tokenAddress, signer) as IERC20;
//         await token.transfer(destination, BigNumber.from(amount))
//     }

//     public static async wrapMatic(signer: SignerWithAddress, amount: string) {
//         const token = await ethers.getContractAt("IWmatic", MaticAddresses.WMATIC_TOKEN, signer) as IWmatic;
//         await token.deposit({ value: utils.parseUnits(amount, 18).toString() })
//     }

//     public static async decimals(tokenAddress: string): Promise<number> {
//         const token = await ethers.getContractAt("ERC20", tokenAddress) as ERC20;
//         return await token.decimals();
//     }

//     public static async tokenName(tokenAddress: string): Promise<string> {
//         const token = await ethers.getContractAt("ERC20", tokenAddress) as ERC20;
//         return await token.name();
//     }

// }
