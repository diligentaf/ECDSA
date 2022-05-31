import { expect } from 'chai'
import { arrayify, id } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Signature Checker', () => {
  let owner, addr1, addr2, addr3 = {}
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
  })

  it('Full Cycle', async () => {
    // const TokenContract = await ethers.getContractFactory("Token");
    // const Token = await TokenContract.connect(addr1).deploy();
    // const ECDSAContract = await ethers.getContractFactory('Drop')
    // const signatureChecker = await ECDSAContract.deploy(Token.address)
  })
})
