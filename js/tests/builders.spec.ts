import { type Quote, type Rfq, type TbDEXMessage } from '../src/types.js'

import { expect } from 'chai'
import { createMessage } from '../src/builders.js'

describe('messages builders', () => {
  it('can build an rfq', () => {
    const rfq: Rfq = {
      offeringId          : '123',
      quoteAmountSubunits : '1000',
      kycProof            : 'fake-jwt',
      payinMethod         : {
        kind: 'APPLE_PAY',
      },
      payoutMethod: {
        kind           : 'BTC_ADDRESS',
        paymentDetails : {
          btcAddress: 'abcd123'
        }
      }
    }

    const actual = createMessage({
      to   : 'alice-did',
      from : 'pfi-did',
      type : 'rfq',
      body : rfq
    })

    expect(actual.body).to.equal(rfq)
    expect(actual.parentId).to.be.null
  })
  it('builds the expected message for an existing thread', () => {
    const rfq: Rfq = {
      offeringId          : '123',
      quoteAmountSubunits : '1000',
      kycProof            : 'fake-jwt',
      payinMethod         : {
        kind: 'APPLE_PAY',
      },
      payoutMethod: {
        kind           : 'BTC_ADDRESS',
        paymentDetails : {
          btcAddress: 'abcd123'
        }
      }
    }

    const rfqMessage: TbDEXMessage<'rfq'> = createMessage({
      to   : 'pfi-did',
      from : 'alice-did',
      type : 'rfq',
      body : rfq
    })

    const quote: Quote = {
      expiryTime : new Date().toISOString(),
      base       : {
        currencyCode   : 'BTC',
        amountSubunits : '33333'
      },
      quote: {
        currencyCode   : 'USD',
        amountSubunits : '1000',
        feeSubunits    : '100'
      },
      paymentInstructions: { payin: { link: 'fake.link.com' } },
    }

    const { from, to, threadId, parentId } = createMessage({
      last : rfqMessage,
      type : 'quote',
      body : quote
    })

    expect(from).to.equal(rfqMessage.from)
    expect(to).to.equal(rfqMessage.to)
    expect(threadId).to.equal(rfqMessage.threadId)
    expect(parentId).to.equal(rfqMessage.id)
  })
})
