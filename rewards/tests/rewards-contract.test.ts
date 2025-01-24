import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { BalanceChecked } from "../generated/schema"
import { BalanceChecked as BalanceCheckedEvent } from "../generated/RewardsContract/RewardsContract"
import { handleBalanceChecked } from "../src/rewards-contract"
import { createBalanceCheckedEvent } from "./rewards-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let balance = BigInt.fromI32(234)
    let newBalanceCheckedEvent = createBalanceCheckedEvent(user, balance)
    handleBalanceChecked(newBalanceCheckedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BalanceChecked created and stored", () => {
    assert.entityCount("BalanceChecked", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BalanceChecked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BalanceChecked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "balance",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
