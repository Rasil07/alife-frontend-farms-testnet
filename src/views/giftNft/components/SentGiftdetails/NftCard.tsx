import React, { useState, useContext, useCallback } from 'react'
import {FacebookIcon,TelegramIcon,TwitterIcon,FacebookShareButton,TelegramShareButton,TwitterShareButton} from 'react-share';
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Heading,
  Tag,
  Button,
  ChevronUpIcon,
  ChevronDownIcon,
  Text,
  CardFooter,
  useModal,
} from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import InfoRow from '../InfoRow'
import Image from "../Image"
import WithdrawNftModal from './WithdrawNftModal';
import IncreaseTokenModal from './IncreaseTokenModel'
import {NftProviderContext} from '../../contexts/NftProvider'



const Header = styled(InfoRow)`
  min-height: 28px;
`
const CustomRow = styled.div`
  width: 100%;
  display: flex;
  padding: 5px;
  align-items: center;
  justify-content: space-between;
`

const DetailsButton = styled(Button).attrs({ variant: 'text', fullWidth: true })`
  height: auto;
  padding: 16px 24px;

  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }

  &:focus:not(:active) {
    box-shadow: none;
  }
`

const InfoBlock = styled.div`
  padding: 0 24px 24px;
`

const Value = styled(Text)`
  font-weight: 600;
`

const SmallCard = styled(Card)`
  width: 500px;
  margin: 0 auto;

  @media (max-width: 767px) {
    width: 320px;
  }
`

const CustomButton = styled(Button)`
  margin-left: 10px;
`

const Grid = styled.div`
  display: flex;
  float: center;
  text-align: center;
  width: 100%;

`
const Section = styled.div`
  width: 100%;
  margin-top: 10px;
`


const NftCard = ({ nft }) => {
  const [state, setState] = useState({
    isLoading: false,
    isOpen: false,
    nftCount: 0,
    nftBurnCount: 0,
  })
  const {account} = useWallet()
  const TranslateString = useI18n()
  const Icon = state.isOpen ? ChevronUpIcon : ChevronDownIcon
  const{reInitialize} = useContext(NftProviderContext)

  
  const {  name, previewImage,description ,tokenname,amount,tokenId,tokenminted,isClaimed,giftName,giftMessage} = nft
  const loggedIn = account !=null

  const fetchDetails = useCallback(async () => {
    setState((prevState) => ({ ...prevState, isLoading: true }))

    try {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }))
    } catch (error) {
      console.error(error)
    }
  }, [])
  const handleSucess =()=>reInitialize()

  const [onWithdrawNft] = useModal(<WithdrawNftModal nft ={nft} onSuccess={handleSucess}/>)
  
  const[onIncreaseToken] = useModal(<IncreaseTokenModal nft={nft}onSuccess={handleSucess}/>)


  const handleClick = async () => {
    if (state.isOpen) {
      setState((prevState) => ({ ...prevState, isOpen: !prevState.isOpen }))
    } else {
      try {
        await fetchDetails()
      } catch (error) {
        console.error(error)
      } finally {
        setState((prevState) => ({ ...prevState, isOpen: !prevState.isOpen }))
      }
    }
  }

  return (
      <>
    <SmallCard>
      <Image src={`/images/nfts/${previewImage}`} alt={name} />

      <CardBody>
        <Header>
          <Heading>{name}</Heading>
          <Tag>
        {amount} {tokenname}
          </Tag>
        </Header>
      <br/>
              
        {loggedIn && !isClaimed &&(
        <Button 
        onClick={onWithdrawNft} mt="24px">
          {TranslateString(999, 'Withdraw Token')}
        </Button>)}

        {loggedIn && isClaimed &&(
            <Button  disabled>
              Claimed
            </Button>
        )}
        
        {"  "}
        
        <Button onClick={onIncreaseToken} disabled ={isClaimed}>
          {TranslateString(999, 'Increase Token Amount')}
        </Button>


   <Grid>
      <Section>          
        <FacebookShareButton url={`${window.location.origin}/gift/${tokenId}`}>
          <FacebookIcon size={32} round/>
        </FacebookShareButton>  
      </Section>
      <Section>
      <TelegramShareButton url={`${window.location.origin}/gift/${tokenId}`}>
          <TelegramIcon size={32} round/>
        </TelegramShareButton>
      </Section>
      <Section>
      <TwitterShareButton url={`${window.location.origin}/gift/${tokenId}`}>
          <TwitterIcon size={32} round/>
        </TwitterShareButton>
      </Section>
      </Grid>
       
      </CardBody>
      <CardFooter p="0">
        <DetailsButton endIcon={<Icon width="24px" color="primary" />} onClick={handleClick}>
          {state.isLoading ? TranslateString(999, 'Loading...') : TranslateString(999, 'Details')}
        </DetailsButton>
        {state.isOpen && (
          <>
          <InfoBlock>
            <Text as="p" color="textSubtle" mb="16px" style={{ textAlign: 'center' }}>
              {description}
            </Text>
            </InfoBlock>
            <CustomRow>
              <Text>{TranslateString(999, 'Number Gifted')}:</Text>
              <Value>
              {tokenminted}
              </Value>
            </CustomRow>
            <CustomRow>
              <Text>Total amount:</Text>
              <Value>{amount}</Value>
              </CustomRow>
              <CustomRow>
              
            <Text as="p" color="textSubtle" style={{ textAlign: 'center', minWidth: 'max-content' }}>
              Gift Name :
            </Text>
            <Heading>{giftName}</Heading>
          </CustomRow>
          <CustomRow>
            <Text as="p" color="textSubtle" mb="16px" style={{ textAlign: 'center', minWidth: 'max-content' }}>
              Gift Message :
            </Text>
              <Text bold mb="16px" style={{ textAlign: 'center' }}>
                {giftMessage}
              </Text>
              </CustomRow>


          </>
        )}
      </CardFooter>
    </SmallCard>
    </>

  )
}

export default NftCard
