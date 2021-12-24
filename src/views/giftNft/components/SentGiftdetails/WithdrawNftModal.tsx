import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button, Modal, Text } from '@pancakeswap-libs/uikit'

import { Nft } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import { useNftGift } from 'hooks/useContract'
import InfoRow from '../InfoRow'

interface GiftNft extends Nft{
    isClaimed:boolean
    tokenId:number
}
interface ClaimNftModalProps {
  nft: GiftNft
  onSuccess: () => any
  onDismiss?: () => void
}

const Value = styled(Text)`
  font-weight: 600;
`

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`

const ClaimNftModal: React.FC<ClaimNftModalProps> = ({ nft, onSuccess, onDismiss }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const TranslateString = useI18n()
  const { account ,chainId} = useWallet()
  const giftContract = useNftGift(chainId)

  const handleConfirm = async () => {
    try {
      await giftContract.methods
        .withdrawToken(nft.tokenId)
        .send({ from: account })
        .on('sending', () => {
          setIsLoading(true)
        })
        .on('receipt', () => {
        setError("Successfully claimed NFT")
          onDismiss()
          onSuccess()
        })
        .on('error', () => {
          console.error(error)
          setError('Unable to claim NFT')
          setIsLoading(false)
        })
    } catch (err) {
      console.error('Unable to mint NFT:', err)
    }
  }

  
  return (
    <Modal title="Withdraw this NFT " onDismiss={onDismiss}>
      <ModalContent>
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}
        <InfoRow>
          <Text>{TranslateString(999, 'You will withdraw tokens from')}:</Text>
          <Value>{`${nft.name} NFT`}</Value>
        </InfoRow>
      </ModalContent>
      <Actions>

        <Button
          fullWidth
          onClick={handleConfirm}
          disabled={!account || isLoading }
        >
          {TranslateString(464, 'Confirm')}
        </Button>
        <Button 
            fullWidth
            disabled ={!account || isLoading}>
            Cancel
            </Button>
      </Actions>
    </Modal>
  )
}

export default ClaimNftModal
