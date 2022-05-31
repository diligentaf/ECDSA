import { expect } from 'chai'
import { arrayify, id } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Signature Checker', () => {
  let owner, addr1, addr2, addr3 = {}
  let Token, Drop, Temp = {}
  let addrs = [{}]
  before(async function () {
    let randomString = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < 30; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      )
    }
    console.log(randomString)

    const [_owner, _addr1, _addr2, _addr3, ..._addrs] = await ethers.getSigners()
    owner = _owner
    addr1 = _addr1
    addr2 = _addr2
    addr2 = _addr2
    addr3 = _addr3
    addrs = _addrs

    // contracts deployment
    const TokenContract = await ethers.getContractFactory('Token')
    Token = await TokenContract.connect(addr1).deploy()
    const DropContract = await ethers.getContractFactory('Linkdrop')
    Drop = await DropContract.deploy(Token.address)
  })

  it('Full Cycle', async () => {
    console.log(Drop.address)
    console.log(Token.address)
    // const TokenContract = await ethers.getContractFactory("Token");
    // const Token = await TokenContract.connect(addr1).deploy();
    // const ECDSAContract = await ethers.getContractFactory('Drop')
    // const signatureChecker = await ECDSAContract.deploy(Token.address)
  })
})
