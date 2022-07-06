# README

## What is this?

This is the package for the **Operator** smart contract of *The Orderbook DEX*.

The **Operator** is a smart contract created and owned by the user to act on behalf of the user to execute trade operations on an **Orderbook** smart contract.

## What else is implemented here?

* An **OperatorFactory** smart contract to create **Operators**.
* An **OperatorLogicRegistry** smart contract that provides the logic an **Operator** should use for each **Orderbook** version.
* An **IOperatorLogic** interface that each **Orderbook** version should implement.
