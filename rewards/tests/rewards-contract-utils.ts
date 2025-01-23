import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BalanceChecked,
  PointsRedeemed,
  PointsRewarded
} from "../generated/RewardsContract/RewardsContract"

export function createBalanceCheckedEvent(
  user: Address,
  balance: BigInt
): BalanceChecked {
  let balanceCheckedEvent = changetype<BalanceChecked>(newMockEvent())

  balanceCheckedEvent.parameters = new Array()

  balanceCheckedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  balanceCheckedEvent.parameters.push(
    new ethereum.EventParam(
      "balance",
      ethereum.Value.fromUnsignedBigInt(balance)
    )
  )

  return balanceCheckedEvent
}

export function createPointsRedeemedEvent(
  user: Address,
  points: BigInt,
  tokens: BigInt
): PointsRedeemed {
  let pointsRedeemedEvent = changetype<PointsRedeemed>(newMockEvent())

  pointsRedeemedEvent.parameters = new Array()

  pointsRedeemedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  pointsRedeemedEvent.parameters.push(
    new ethereum.EventParam("points", ethereum.Value.fromUnsignedBigInt(points))
  )
  pointsRedeemedEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromUnsignedBigInt(tokens))
  )

  return pointsRedeemedEvent
}

export function createPointsRewardedEvent(
  user: Address,
  points: BigInt
): PointsRewarded {
  let pointsRewardedEvent = changetype<PointsRewarded>(newMockEvent())

  pointsRewardedEvent.parameters = new Array()

  pointsRewardedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  pointsRewardedEvent.parameters.push(
    new ethereum.EventParam("points", ethereum.Value.fromUnsignedBigInt(points))
  )

  return pointsRewardedEvent
}
