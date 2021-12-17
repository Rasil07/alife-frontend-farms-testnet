import { AbiItem, fromWei } from 'web3-utils'
import { getContract } from 'utils/web3'
import { ContractOptions } from 'web3-eth-contract'
import nftFarm from 'config/abi/NftFarmV2.json'
import erc20 from 'config/abi/erc20.json'

import nft from 'config/abi/NFT.json'
import nftwithToken from 'config/abi/NftWithToken.json'

import { NftFarm, NFT, NftWithToken } from 'config/constants/newnfts'
import { useNftGift, useERC20 } from 'hooks/useContract'

import BigNumber from 'bignumber.js'
// TODO: Figure out how to add current account to contracts to write methods can be used

export const getNftMintingContract = (contractOptions?: ContractOptions) => {
  const nftMintingFarmAbi = nftFarm as unknown as AbiItem
  return getContract(nftMintingFarmAbi, NftFarm, contractOptions)
}

export const getNftContract = (contractOptions?: ContractOptions) => {
  const nftAbi = nft as unknown as AbiItem
  return getContract(nftAbi, NFT, contractOptions)
}

export const getNewNftContract = (contractOptions?: ContractOptions) => {
  const nftAbi = nftFarm as unknown as AbiItem
  return getContract(nftAbi, NftFarm, contractOptions)
}

export const getNftwithTokenContract = (contractOptions?: ContractOptions) => {
  const nftAbi = nftwithToken as unknown as AbiItem
  const contract = getContract(nftAbi, NftWithToken, contractOptions)
  return contract
}
export const getERC20Contract = (address:string)=>{
  const erc20Abi = erc20 as unknown as AbiItem
  const contract = getContract(erc20Abi,address);
  return contract;
}

export const getFromWei = (v: any) => {
  if (!v) return 0
  return parseFloat(fromWei(v.toString(), 'ether'))
}

export const getFromWayArray = (v: any) => {
  if (!v) return []
  const array = []
  const t = v.length
  for (let i = 0; i < t; i++) {
    if (!v[i]) {
      array.push(0)
    } else {
      array.push(fromWei(v[i].toString(), 'ether'))
    }
  }
  return array
}

export const getToFloat = (v: any) => {
  if (!v) return []
  const array = []
  if (!v) return []
  const t = v.length
  for (let i = 0; i < t; i++) {
    if (!v[i]) {
      array.push(0)
    } else {
      array.push(parseInt(v[i].toString()))
    }
  }
  return array
}

export const getToInt = (v: any) => {
  const array = []
  if (!v) return []
  const t = v.length
  for (let i = 0; i < t; i++) {
    if (!v[i]) {
      array.push(0)
    } else {
      array.push(parseFloat(v[i].toString()))
    }
  }
  return array
}

export default getNftMintingContract
