import {
  BalanceChecked as BalanceCheckedEvent,
  PointsRedeemed as PointsRedeemedEvent,
  PointsRewarded as PointsRewardedEvent
} from "../generated/RewardsContract/RewardsContract"
import {
  BalanceChecked,
  PointsRedeemed,
  PointsRewarded
} from "../generated/schema"

export function handleBalanceChecked(event: BalanceCheckedEvent): void {
  let entity = new BalanceChecked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.balance = event.params.balance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePointsRedeemed(event: PointsRedeemedEvent): void {
  let entity = new PointsRedeemed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.points = event.params.points
  entity.tokens = event.params.tokens

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePointsRewarded(event: PointsRewardedEvent): void {
  let entity = new PointsRewarded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.points = event.params.points

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
