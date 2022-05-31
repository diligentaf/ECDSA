import { expect } from 'chai'
import { arrayify, id } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

describe('Signature Checker', () => {
  it('Full Cycle', async () => {
    const [claimer, friend] = await ethers.getSigners()

    const ECDSAContract = await ethers.getContractFactory('SignatureChecker')
    const signatureChecker = await ECDSAContract.deploy()

    const catHash = await signatureChecker.CAT()
    const catHash2 = await signatureChecker.CAT2()
    const catHash3 = await signatureChecker.CAT3()
    console.log(catHash)
    console.log(catHash3)
    console.log(catHash2)
    const temp = id('CatManyo'+signatureChecker.address)
    const temp2 = 'CatManyo'+signatureChecker.address
    // console.log(temp2)
    console.log(temp)
    console.log(await signatureChecker.ad())
    console.log(signatureChecker.address)

    if (await signatureChecker.ad() == signatureChecker.address) {
      console.log('contract address is same')
    }

    if (catHash2 == temp) {
      console.log('//////////////')
      console.log('hash matches')
      console.log('//////////////')
    }

    expect(catHash).to.eq(id('Cat'))

    expect(await signatureChecker.claimer()).to.eq(claimer.address)

    const claimerSignature = await claimer.signMessage(arrayify(catHash))

    expect(await signatureChecker.isValidSignature(claimerSignature)).to.eq(
      true
    )

    const friendSignature = await friend.signMessage(arrayify(catHash))

    expect(await signatureChecker.isValidSignature(friendSignature)).to.eq(
      false
    )

    expect(await signatureChecker.giftsClaimed()).to.eq(0)

    await signatureChecker.claimGift(claimerSignature)

    expect(await signatureChecker.giftsClaimed()).to.eq(1)

    await expect(
      signatureChecker.claimGift(friendSignature)
    ).to.be.revertedWith('SignatureChecker: Invalid Signature')
  })
})
